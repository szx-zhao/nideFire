module.exports = class extends think.Model {
// 分类，获取一个类别的所有子类别的id值，并将这些id值和该类别的id值组成一个数组返回。 



/**getChildCategoryId方法接受一个parentId参数，
 * 使用where方法查询数据库中parent_id等于parentId的记录，并使用getField方法获取这些记录的id字段值，最多获取10000个。
 * 然后，返回这些id值的数组。
 */
  async getChildCategoryId(parentId) {
    const childIds = await this.where({parent_id: parentId}).getField('id', 10000);
    return childIds;
  }

  /**getCategoryWhereIn方法接受一个categoryId参数，
   * 调用getChildCategoryId方法获取categoryId的所有子类别的id值，并将categoryId的id值添加到这个数组中
   * 最后，返回这个数组
   */
  async getCategoryWhereIn(categoryId) {
    const childIds = await this.getChildCategoryId(categoryId);
    childIds.push(categoryId);
    return childIds;
  }
};
