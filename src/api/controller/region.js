const Base = require('./base.js');
//地区信息存储控制器


module.exports = class extends Base {
  async infoAction() {
    /**
     * infoAction()方法使用this.get('regionId')获取区域ID，然后调用region模型中的getRegionInfo()方法来获取该区域的信息。
     * 最后，使用this.success(region)将该区域信息作为成功响应返回。
     */
    const region = await this.model('region').getRegionInfo(this.get('regionId'));
    return this.success(region);
  }

  async listAction() {
    /**
     * this.get('parentId')获取父级区域ID，然后调用region模型中的getRegionList()方法来获取该父级区域下的所有子区域列表。
     * 最后，使用this.success(regionList)将该子区域列表作为成功响应返回。
     */
    const regionList = await this.model('region').getRegionList(this.get('parentId'));
    return this.success(regionList);
  }
};
