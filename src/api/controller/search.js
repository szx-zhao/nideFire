const Base = require('./base.js');
// 搜索模块的控制器。实现了搜索模块的基本功能，包括获取默认关键词、热门关键词、历史搜索记录、匹配关键词和清空搜索历史记录。 

module.exports = class extends Base {
  /**
   * indexAction方法用于获取搜索页面的默认关键词、热门关键词和历史搜索记录。
   * 
   * 具体实现是通过调用model中的keywords和search_history表的方法，
   * 分别获取is_default为1的关键词、前10个不同的关键词和当前用户的前10个搜索记录。最后将这些数据打包成一个对象返回。
   */
  async indexAction() {
    // 取出输入框默认的关键词
    const defaultKeyword = await this.model('keywords').where({ is_default: 1 }).limit(1).find();
    // 取出热闹关键词
    const hotKeywordList = await this.model('keywords').distinct('keyword').field(['keyword', 'is_hot']).limit(10).select();
    const historyKeywordList = await this.model('search_history').distinct('keyword').where({ user_id: this.getLoginUserId() }).limit(10).getField('keyword');

    return this.success({
      defaultKeyword: defaultKeyword,
      historyKeywordList: historyKeywordList,
      hotKeywordList: hotKeywordList
    });
  }

  /**
   * helperAction方法获取与输入关键词匹配的前10个关键词。
   * 
   * 具体实现是通过调用model中的keywords表的方法，查询出所有以输入关键词开头的关键词，并返回前10个。
   */
  async helperAction() {
    const keyword = this.get('keyword');
    const keywords = await this.model('keywords').distinct('keyword').where({ keyword: ['like', keyword + '%'] }).getField('keyword', 10);
    return this.success(keywords);
  }

  /**
   *clearhistoryAction方法用于清空当前用户的搜索历史记录。
   * 具体实现是通过调用model中的search_history表的方法，删除所有user_id为当前用户id的记录。
   */
  async clearhistoryAction() {
    await this.model('search_history').where({ user_id: this.getLoginUserId() }).delete();
    return this.success();
  }
};
