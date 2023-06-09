module.exports = class extends think.Model {
//作用是提供一些方法来查询快递公司的信息

  /**
   * 根据快递公司编码获取名称
   * 
   * 接受一个参数shipperCode，它使用where方法查询数据库中code字段等于shipperCode的记录，并返回name字段的值。
   * @param shipperCode
   * @returns {Promise.<*>}
   */
  async getShipperNameByCode(shipperCode) {
    return this.where({ code: shipperCode }).getField('name', true);
  }

  /**
   * 根据 id 获取快递公司信息
   * 
   * 接受一个参数shipperId，它使用where方法查询数据库中id字段等于shipperId的记录，并返回该记录。这些方法都返回一个Promise对象
   * @param shipperId
   * @returns {Promise.<*>}
   */
  async getShipperById(shipperId) {
    return this.where({ id: shipperId }).find();
  }
};
