const Base = require('./base.js');
//评论控制器，用于处理与评论相关的请求。


module.exports = class extends Base {
  /**
   * 评论类型说明：
   * 0 商品
   * 1 专题
   */

  /**
   * 发表评论
   * @returns {Promise.<*|PreventPromise|void|Promise>}
   */
  async postAction() {
    /**
     * postAction方法用于发表评论。
     * 它从请求中获取typeId、valueId和content，将content转换为base64编码，并将这些值插入到数据库中。
     * 如果插入成功，返回“评论添加成功”，否则返回“评论保存失败”。
     * 
     */
    const typeId = this.post('typeId');
    const valueId = this.post('valueId');
    const content = this.post('content');
    const buffer = Buffer.from(content);
    const insertId = await this.model('comment').add({
      type_id: typeId,
      value_id: valueId,
      content: buffer.toString('base64'),
      add_time: this.getTime(),
      user_id: this.getLoginUserId()
    });

    if (insertId) {
      return this.success('评论添加成功');
    } else {
      return this.fail('评论保存失败');
    }
  }

  async countAction() {
    /**
     * countAction方法用于获取评论数量。
     * 它从请求中获取typeId和valueId，并使用这些值从数据库中获取所有评论数量和包含图片的评论数量。
     * 然后将这些值作为对象返回。
     */
    const typeId = this.get('typeId');
    const valueId = this.get('valueId');

    const allCount = await this.model('comment').where({type_id: typeId, value_id: valueId}).count('id');

    const hasPicCount = await this.model('comment').alias('comment')
      .join({
        table: 'comment_picture',
        join: 'right',
        alias: 'comment_picture',
        on: ['id', 'comment_id']
      }).where({'comment.type_id': typeId, 'comment.value_id': valueId}).count('comment.id');

    return this.success({
      allCount: allCount,
      hasPicCount: hasPicCount
    });
  }

  async listAction() {
    /**
     * listAction方法用于获取评论列表。
     * 它从请求中获取typeId、valueId、showType、page和size。如果showType不等于1，则从数据库中获取所有评论，并将其分页。
     * 否则，获取包含图片的评论，并将其分页。
     * 然后将评论列表返回，其中每个评论都包含评论内容、类型ID、值ID、评论ID、添加时间、用户信息和图片列表。
     */
    const typeId = this.get('typeId');
    const valueId = this.get('valueId');
    const showType = this.get('showType'); // 选择评论的类型 0 全部， 1 只显示图片

    const page = this.get('page');
    const size = this.get('size');

    let comments = [];
    if (showType !== 1) {
      comments = await this.model('comment').where({
        type_id: typeId,
        value_id: valueId
      }).page(page, size).countSelect();
    } else {
      comments = await this.model('comment').alias('comment')
        .field(['comment.*'])
        .join({
          table: 'comment_picture',
          join: 'right',
          alias: 'comment_picture',
          on: ['id', 'comment_id']
        }).page(page, size).where({'comment.type_id': typeId, 'comment.value_id': valueId}).countSelect();
    }

    const commentList = [];
    for (const commentItem of comments.data) {
      const comment = {};
      comment.content = Buffer.from(commentItem.content, 'base64').toString();
      comment.type_id = commentItem.type_id;
      comment.value_id = commentItem.value_id;
      comment.id = commentItem.id;
      comment.add_time = think.datetime(new Date(commentItem.add_time * 1000));
      comment.user_info = await this.model('user').field(['username', 'avatar', 'nickname']).where({id: commentItem.user_id}).find();
      comment.pic_list = await this.model('comment_picture').where({comment_id: commentItem.id}).select();
      commentList.push(comment);
    }
    comments.data = commentList;
    return this.success(comments);
  }
};
