module.exports = class extends think.Model {


  get tableName() {
    return this.tablePrefix + 'order_express';
  }

  /**
   * 获取最新的订单物流信息。该方法接受一个orderId参数，返回一个包含物流信息的对象。该方法的作用是获取指定订单的最新物流信息，并将其更新到数据库中。 
   * 
   * 首先，该方法定义了一个名为returnExpressInfo的对象，包含了物流信息的各个字段。
   * 然后，它通过this.where({ order_id: orderId }).find()查询数据库中指定订单的物流信息。
   * 如果查询结果为空，直接返回returnExpressInfo对象。
   * 如果查询结果中的shipper_code或logistic_code为空，也直接返回returnExpressInfo对象。
   * 
   * 接下来，该方法将查询结果中的各个字段赋值给returnExpressInfo对象的相应字段。
   * 其中，request_time字段通过think.datetime方法将时间戳转换为日期格式。
   * traces字段通过JSON.parse方法将JSON字符串转换为对象。如果物流配送已完成，直接返回returnExpressInfo对象。
   * 
   * 如果物流配送未完成，该方法调用think.service方法获取express服务，并调用queryExpress方法查询最新物流信息。
   * 如果查询成功，将最新物流信息的各个字段赋值给returnExpressInfo对象的相应字段。
   * 然后，该方法将最新物流信息的traces字段转换为JSON字符串，并将其更新到数据库中。
   * 
   * 最后，该方法返回returnExpressInfo对象。
   * @param orderId
   * @returns {Promise.<*>}
   */
  async getLatestOrderExpress(orderId) {
    const returnExpressInfo = {
      shipper_code: '',
      shipper_name: '',
      logistic_code: '',
      is_finish: 0,
      request_time: 0,
      traces: []
    };
    const orderExpress = await this.where({ order_id: orderId }).find();
    if (think.isEmpty(orderExpress)) {
      return returnExpressInfo;
    }
    if (think.isEmpty(orderExpress.shipper_code) || think.isEmpty(orderExpress.logistic_code)) {
      return returnExpressInfo;
    }

    returnExpressInfo.shipper_code = orderExpress.shipper_code;
    returnExpressInfo.shipper_name = orderExpress.shipper_name;
    returnExpressInfo.logistic_code = orderExpress.logistic_code;
    returnExpressInfo.is_finish = orderExpress.is_finish;
    returnExpressInfo.request_time = think.datetime(orderExpress.request_time * 1000);
    returnExpressInfo.traces = think.isEmpty(orderExpress.traces) ? [] : JSON.parse(orderExpress.traces);

    // 如果物流配送已完成，直接返回
    if (orderExpress.is_finish) {
      return returnExpressInfo;
    }

    // 查询最新物流信息
    const ExpressSerivce = think.service('express', 'api');
    const latestExpressInfo = await ExpressSerivce.queryExpress(orderExpress.shipper_code, orderExpress.logistic_code);
    const nowTime = Number.parseInt(Date.now() / 1000);
    const updateData = {
      request_time: nowTime,
      update_time: nowTime,
      request_count: ['EXP', 'request_count+1']
    };
    if (latestExpressInfo.success) {
      returnExpressInfo.traces = latestExpressInfo.traces;
      returnExpressInfo.is_finish = latestExpressInfo.isFinish;
      // 查询成功则更新订单物流信息
      updateData.traces = JSON.stringify(latestExpressInfo.traces);
      returnExpressInfo.request_time = think.datetime(nowTime * 1000);
      updateData.is_finish = latestExpressInfo.isFinish;
    }
    await this.where({ id: orderExpress.id }).update(updateData);
    return returnExpressInfo;
  }
};
