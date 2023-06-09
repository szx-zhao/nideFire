const Base = require('./base.js');

//控制器模块的 地址控制器，包含了获取用户收货地址列表、获取收货地址详情、添加或更新收货地址、删除指定收货地址等功能。

module.exports = class extends Base {
  /**
   * 获取用户的收货地址
   * listAction函数通过查询数据库获取用户的收货地址列表，并通过循环遍历每个地址，获取对应的省、市、区名称，并将它们拼接成完整的地址信息。
   * itemKey变量用于跟踪addressList数组中的当前索引
   * 
   * this.model('address')和this.model('region')都是在thinkjs框架中定义的模型对象，用于操作数据库
   * 
   * @return {Promise} []
   */
  async listAction() {
    const addressList = await this.model('address').where({user_id: this.getLoginUserId()}).select();
    let itemKey = 0;
    for (const addressItem of addressList) {
      addressList[itemKey].province_name = await this.model('region').getRegionName(addressItem.province_id);
      addressList[itemKey].city_name = await this.model('region').getRegionName(addressItem.city_id);
      addressList[itemKey].district_name = await this.model('region').getRegionName(addressItem.district_id);
      addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
      itemKey += 1;
    }

    return this.success(addressList);
  }

  /**
   * 获取收货地址的详情
   * detailAction函数通过地址id查询数据库获取对应的收货地址详情，并同样获取对应的省、市、区名称，最后将它们拼接成完整的地址信息。
   * @return {Promise} []
   */
  async detailAction() {
    const addressId = this.get('id');

    const addressInfo = await this.model('address').where({user_id: this.getLoginUserId(), id: addressId}).find();
    if (!think.isEmpty(addressInfo)) {
      addressInfo.province_name = await this.model('region').getRegionName(addressInfo.province_id);
      addressInfo.city_name = await this.model('region').getRegionName(addressInfo.city_id);
      addressInfo.district_name = await this.model('region').getRegionName(addressInfo.district_id);
      addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
    }

    return this.success(addressInfo);
  }

  /**
   * 添加或更新收货地址
   * 根据传入的参数判断是添加还是更新，然后将数据存入数据库中。如果设置了默认地址，则将其它地址的默认状态取消。deleteAction函数用于删除指定的收货地址。 
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async saveAction() {
    let addressId = this.post('id');

    const addressData = {
      name: this.post('name'),
      mobile: this.post('mobile'),
      province_id: this.post('province_id'),
      city_id: this.post('city_id'),
      district_id: this.post('district_id'),
      address: this.post('address'),
      user_id: this.getLoginUserId(),
      is_default: this.post('is_default') === true ? 1 : 0
    };

    if (think.isEmpty(addressId)) {
      addressId = await this.model('address').add(addressData);
    } else {
      await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).update(addressData);
    }

    // 如果设置为默认，则取消其它的默认
    if (this.post('is_default') === true) {
      await this.model('address').where({id: ['<>', addressId], user_id: this.getLoginUserId()}).update({
        is_default: 0
      });
    }
    const addressInfo = await this.model('address').where({id: addressId}).find();

    return this.success(addressInfo);
  }

  /**
   * 删除指定的收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async deleteAction() {
    const addressId = this.post('id');

    await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).delete();

    return this.success('删除成功');
  }
};
