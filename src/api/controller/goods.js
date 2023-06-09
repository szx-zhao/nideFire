const Base = require('./base.js');
// 商品控制器，包含了多个方法


module.exports = class extends Base {
  async indexAction() {
    /**
     * 获取所有商品列表
     * 
     * 通过调用model('goods')的select方法获取所有商品信息，然后返回成功信息和商品列表。
     */
    const model = this.model('goods');
    const goodsList = await model.select();

    return this.success(goodsList);
  }

  /**
   * 获取sku信息，用于购物车编辑时选择规格
   * 
   * 通过传入商品id，调用model('goods')的getSpecificationList和getProductList方法获取商品的规格和产品信息，然后返回成功信息和规格和产品列表。
   * @returns {Promise.<Promise|PreventPromise|void>}
   * 注释表明函数返回一个Promise,这个Promise可能(最终)解析为几种类型的值。Promise 对象代表一个异步操作
   */
  async skuAction() {
    const goodsId = this.get('id');
    const model = this.model('goods');

    return this.success({
      specificationList: await model.getSpecificationList(goodsId),
      productList: await model.getProductList(goodsId)
    });
  }

  /**
   * 商品详情页数据
   * 
   * 通过传入商品id，调用model('goods')的where方法获取商品信息，
   * 调用model('goods_gallery')、model('goods_attribute')、model('goods_issue')、model('brand')、model('comment')、model('user')和model('comment_picture')等方法
   * 取商品的图片、属性、问题、品牌、评论、用户和评论图片等信息，然后返回成功信息和商品详情页数据。
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async detailAction() {
    const goodsId = this.get('id');
    const model = this.model('goods');

    const info = await model.where({'id': goodsId}).find();
    const gallery = await this.model('goods_gallery').where({goods_id: goodsId}).limit(4).select();
    const attribute = await this.model('goods_attribute').field('nideshop_goods_attribute.value, nideshop_attribute.name').join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id').order({'nideshop_goods_attribute.id': 'asc'}).where({'nideshop_goods_attribute.goods_id': goodsId}).select();
    const issue = await this.model('goods_issue').select();
    const brand = await this.model('brand').where({id: info.brand_id}).find();
    const commentCount = await this.model('comment').where({value_id: goodsId, type_id: 0}).count();
    const hotComment = await this.model('comment').where({value_id: goodsId, type_id: 0}).find();
    let commentInfo = {};
    if (!think.isEmpty(hotComment)) {
      const commentUser = await this.model('user').field(['nickname', 'username', 'avatar']).where({id: hotComment.user_id}).find();
      commentInfo = {
        content: Buffer.from(hotComment.content, 'base64').toString(),
        add_time: think.datetime(new Date(hotComment.add_time * 1000)),
        nickname: commentUser.nickname,
        avatar: commentUser.avatar,
        pic_list: await this.model('comment_picture').where({comment_id: hotComment.id}).select()
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo
    };

    // 当前用户是否收藏
    const userHasCollect = await this.model('collect').isUserHasCollect(this.getLoginUserId(), 0, goodsId);

    // 记录用户的足迹 TODO
    await await this.model('footprint').addFootprint(this.getLoginUserId(), goodsId);

    // return this.json(jsonData);
    return this.success({
      info: info,
      gallery: gallery,
      attribute: attribute,
      userHasCollect: userHasCollect,
      issue: issue,
      comment: comment,
      brand: brand,
      specificationList: await model.getSpecificationList(goodsId),
      productList: await model.getProductList(goodsId)
    });
  }

  /**
   * 获取分类下的商品
   * 
   * 通过传入分类id，调用model('category')的where方法获取当前分类信息，
   * 调用model('category')的where方法获取当前分类的父分类信息，
   * 调用model('category')的where方法获取当前分类的兄弟分类信息，然后返回成功信息和分类信息。
   * @returns {Promise.<*>}
   */
  async categoryAction() {
    const model = this.model('category');
    const currentCategory = await model.where({id: this.get('id')}).find();
    const parentCategory = await model.where({id: currentCategory.parent_id}).find();
    const brotherCategory = await model.where({parent_id: currentCategory.parent_id}).select();

    return this.success({
      currentCategory: currentCategory,
      parentCategory: parentCategory,
      brotherCategory: brotherCategory
    });
  }

  /**
   * 获取商品列表
   * 
   * 通过传入分类id、品牌id、关键字、是否新品、是否热销、页码、每页数量、排序方式和排序顺序等参数，
   * 调用model('goods')的where方法获取符合条件的商品信息，调用model('search_history')的add方法添加搜索历史，
   * 调用model('category')的getCategoryWhereIn方法获取符合条件的分类id，然后返回成功信息和商品列表。 
   * @returns {Promise.<*>}
   */
  async listAction() {
    const categoryId = this.get('categoryId');
    const brandId = this.get('brandId');
    const keyword = this.get('keyword');
    const isNew = this.get('isNew');
    const isHot = this.get('isHot');
    const page = this.get('page');
    const size = this.get('size');
    const sort = this.get('sort');
    const order = this.get('order');

    const goodsQuery = this.model('goods');

    const whereMap = {};
    if (!think.isEmpty(isNew)) {
      whereMap.is_new = isNew;
    }

    if (!think.isEmpty(isHot)) {
      whereMap.is_hot = isHot;
    }

    if (!think.isEmpty(keyword)) {
      whereMap.name = ['like', `%${keyword}%`];
      // 添加到搜索历史
      await this.model('search_history').add({
        keyword: keyword,
        user_id: this.getLoginUserId(),
        add_time: parseInt(new Date().getTime() / 1000)
      });
    }

    if (!think.isEmpty(brandId)) {
      whereMap.brand_id = brandId;
    }

    // 排序
    let orderMap = {};
    if (sort === 'price') {
      // 按价格
      orderMap = {
        retail_price: order
      };
    } else {
      // 按商品添加时间
      orderMap = {
        id: 'desc'
      };
    }

    // 筛选的分类
    let filterCategory = [{
      'id': 0,
      'name': '全部',
      'checked': false
    }];

    const categoryIds = await goodsQuery.where(whereMap).getField('category_id', 10000);
    if (!think.isEmpty(categoryIds)) {
      // 查找二级分类的parent_id
      const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
      // 一级分类
      const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

      if (!think.isEmpty(parentCategory)) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    // 加入分类条件
    if (!think.isEmpty(categoryId) && parseInt(categoryId) > 0) {
      whereMap.category_id = ['in', await this.model('category').getCategoryWhereIn(categoryId)];
    }

    // 搜索到的商品
    const goodsData = await goodsQuery.where(whereMap).field(['id', 'name', 'list_pic_url', 'retail_price','goods_number']).order(orderMap).page(page, size).countSelect();
    goodsData.filterCategory = filterCategory.map(function(v) {
      v.checked = (think.isEmpty(categoryId) && v.id === 0) || v.id === parseInt(categoryId);
      return v;
    });
    goodsData.goodsList = goodsData.data;

    return this.success(goodsData);
  }

  /**
   * 商品列表筛选的分类列表
   * 
   * 该函数的作用是根据传入的筛选条件，从数据库中获取商品信息，并返回筛选后的商品分类信息。
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async filterAction() {
    const categoryId = this.get('categoryId');
    const keyword = this.get('keyword');
    const isNew = this.get('isNew');
    const isHot = this.get('isHot');

    const goodsQuery = this.model('goods');

    if (!think.isEmpty(categoryId)) {
      goodsQuery.where({category_id: {'in': await this.model('category').getChildCategoryId(categoryId)}});
    }

    if (!think.isEmpty(isNew)) {
      goodsQuery.where({is_new: isNew});
    }

    if (!think.isEmpty(isHot)) {
      goodsQuery.where({is_hot: isHot});
    }

    if (!think.isEmpty(keyword)) {
      goodsQuery.where({name: {'like': `%${keyword}%`}});
    }

    let filterCategory = [{
      'id': 0,
      'name': '全部'
    }];

    // 二级分类id
    const categoryIds = await goodsQuery.getField('category_id', 10000);
    if (!think.isEmpty(categoryIds)) {
      // 查找二级分类的parent_id
      const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
      // 一级分类
      const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

      if (!think.isEmpty(parentCategory)) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    return this.success(filterCategory);
  }

  /**
   * 新品首发
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async newAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '坚持初心',
        img_url: 'https://www.119.gov.cn/images/kp/hzyf/gcjz/2022/11/03/1667447176510064937.png'
      }
    });
  }

  /**
   * 人气推荐
   * @returns {Promise.<Promise|void|PreventPromise>}
   */
  async hotAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '安全靠大家',
        img_url: 'https://www.119.gov.cn/images/kp/hzyf/gcjz/2022/11/03/1667447176510064937.png'
      }
    });
  }

  /**
   * 商品详情页的大家都在看的商品
   * 
   * 首先获取当前商品的 id，然后在 related_goods 表中查找与该商品关联的商品的 id，
   * 然后在 related_goods 表中查找与该商品关联的商品的 id，
   * 如果没有关联商品，则在同一分类下随机选择 8 个商品作为“大家都在看”的商品；
   * 如果有关联商品，则直接获取这些商品的信息。最后将商品列表返回给前端。
   * 
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async relatedAction() {
    // 大家都在看商品,取出关联表的商品，如果没有则随机取同分类下的商品
    const model = this.model('goods');
    const goodsId = this.get('id');
    const relatedGoodsIds = await this.model('related_goods').where({goods_id: goodsId}).getField('related_goods_id');
    let relatedGoods = null;
    if (think.isEmpty(relatedGoodsIds)) {
      // 查找同分类下的商品
      const goodsCategory = await model.where({id: goodsId}).find();
      relatedGoods = await model.where({category_id: goodsCategory.category_id}).field(['id', 'name', 'list_pic_url', 'retail_price','goods_number']).limit(8).select();
    } else {
      relatedGoods = await model.where({id: ['IN', relatedGoodsIds]}).field(['id', 'name', 'list_pic_url', 'retail_price','goods_number']).select();
    }

    return this.success({
      goodsList: relatedGoods
    });
  }

  /**
   * 在售的商品总数
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async countAction() {
    const goodsCount = await this.model('goods').where({is_delete: 0, is_on_sale: 1}).count('id');

    return this.success({
      goodsCount: goodsCount
    });
  }
};
