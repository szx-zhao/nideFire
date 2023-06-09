const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');
// user控制器类

module.exports = class extends Base {
  /**
   * infoAction()方法通过调用model('user')方法查询当前登录用户的信息，并删除了userInfo对象中的password属性，最后返回一个JSON格式的userInfo对象。
   * 
   */
  async infoAction() {
    const userInfo = await this.model('user').where({id: this.getLoginUserId()}).find();
    delete userInfo.password;
    return this.json(userInfo);
  }

  /**
   * 保存用户头像
   * 
   * saveAvatarAction()方法用于保存用户头像。首先通过this.file('avatar')获取上传的头像文件，如果头像文件为空，则返回一个fail信息
   * 接着，通过think.RESOURCE_PATH和this.getLoginUserId()获取头像文件的路径，并将其重命名为avatarPath。
   * 最后，通过fs.rename()方法将上传的头像文件重命名为avatarPath，并返回一个success信息。
   * @returns {Promise.<void>}
   */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    fs.rename(avatar.path, avatarPath, function(res) {
      return this.success();
    });
  }
};
