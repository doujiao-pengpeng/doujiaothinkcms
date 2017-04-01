'use strict';

/**
 *调用第三方极验验证
 */

import Geetest from 'geetest';
export default class extends think.service.base {
  /**
   * init
   * @return {}         []
   */
  init(http){
    super.init(http);
  }

  /* 初始化 */
  async register(){

  	// 配置公匙
  	let geetest = new Geetest({
	  	geetest_id: 'bd6d60a559314a9b73235c7aedad68ce',
	    geetest_key: 'df5cc9df7498fa104362fec789cbb053'
	  });

  	// 初始化
	  let register=() =>{
      let deferred = think.defer();
      // 向极验申请一次验证所需的challenge
      geetest.register(function (err,data) {
        console.log(data);
        deferred.resolve({
          gt: geetest.geetest_id,
          challenge: data.challenge,
          success: data.success
        });
      });
      return deferred.promise;
    }

    return await register();
  }

  // 二次服务器验证
  async validate(data,type){

    // 配置公匙
  	let geetest = new Geetest({
	  	geetest_id:  'bd6d60a559314a9b73235c7aedad68ce',
	    geetest_key: 'df5cc9df7498fa104362fec789cbb053'
	  });
    
    //验证
    let validate = (data)=>{
      let deferred = think.defer();
      geetest.validate({

        challenge: data.geetest_challenge,
        validate: data.geetest_validate,
        seccode: data.geetest_seccode

      }, function (err, result) {
        console.log(result);
        var data = {status: "success"};

        if (err || !result) {
          console.log(err);
          data.status = "fail";
        }

        deferred.resolve(data);
      });
      return deferred.promise;
    }
    return await validate(data);
  }
 
}