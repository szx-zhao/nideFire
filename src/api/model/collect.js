module.exports = class extends think.Model {
  /**
   * 判断用户是否收藏过该对象
   * @param userId
   * @param typeId
   * @param valueId
   * userId表示用户ID，typeId表示对象类型ID，valueId表示对象ID。
   * @returns {Promise.<boolean>}
   * 函数内部使用this.where方法查询数据库，查询条件为type_id等于typeId，value_id等于valueId，user_id等于userId，
   * 并使用limit(1)限制查询结果为一条记录，最后使用count('id')方法统计查询结果的数量。
   * 函数返回查询结果的数量，如果数量大于0，则表示用户已经收藏过该对象，否则表示用户未收藏过该对象
   */
  async isUserHasCollect(userId, typeId, valueId) {
    const hasCollect = await this.where({type_id: typeId, value_id: valueId, user_id: userId}).limit(1).count('id');
    return hasCollect;
  }
};
