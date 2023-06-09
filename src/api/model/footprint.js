module.exports = class extends think.Model {
// 用于向数据库中添加用户的足迹记录，实现用户足迹的记录功能。 


/**
 * 首先判断用户是否已经登录，只有登录后才能添加足迹。
 * 如果用户已经登录，则向数据库中添加一条记录，包括商品ID、用户ID和添加时间
 * 其中，添加时间使用Date.now()获取当前时间戳，再除以1000取整，得到的是以秒为单位的时间戳。
 * 最后，使用await关键字等待添加操作完成。
 */
  async addFootprint(userId, goodsId) {
    // 用户已经登录才可以添加到足迹
    if (userId > 0 && goodsId > 0) {
      await this.add({
        goods_id: goodsId,
        user_id: userId,
        add_time: parseInt(Date.now() / 1000)
      });
    }
  }
};
