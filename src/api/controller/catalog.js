const Base = require('./base.js');
//名为catalog的分类栏控制器类


module.exports = class extends Base {
  /**
   * 获取分类栏目数据，indexAction方法用于获取分类栏目数据，需要返回所有分类数据，
   * 
   * 首先从请求参数中获取分类ID，然后使用category模型查询所有parent_id为0的分类数据，并限制返回结果数量为10。
   * 接着判断是否传入了分类ID，如果有则查询该分类数据并将结果赋值给currentCategory，否则将data数组的第一个元素赋值给currentCategory。
   * 最后，如果currentCategory存在且其id属性不为空，则查询其子分类数据并将结果赋值给currentCategory的subCategoryList属性。
   * 最终返回一个包含categoryList和currentCategory属性的成功响应。
   * 
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async indexAction() {
    const categoryId = this.get('id');

    const model = this.model('category');
    const data = await model.limit(10).where({parent_id: 0}).select();

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await model.where({'id': categoryId}).find();
    }

    if (think.isEmpty(currentCategory)) {
      currentCategory = data[0];
    }

    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await model.where({'parent_id': currentCategory.id}).select();
    }

    return this.success({
      categoryList: data,
      currentCategory: currentCategory
    });
  }

/**
 * currentAction方法与indexAction类似，只是不返回categoryList属性，仅返回currentCategory属性。 
 * 
 * currentAction方法仅用于获取当前分类数据，不需要返回所有分类数据。
 * */ 

  async currentAction() {
    const categoryId = this.get('id');
    const model = this.model('category');

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await model.where({'id': categoryId}).find();
    }
    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await model.where({'parent_id': currentCategory.id}).select();
    }

    return this.success({
      currentCategory: currentCategory
    });
  }
};
