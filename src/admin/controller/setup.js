'use strict';

import Base from './base.js';
export default class extends Base {
	/**
   * index action
   * @return {Promise} []
   */

  init(http){
  	super.init(http);
  	this.db = this.model('setup');
  	this.tactive = "setup";
  }

  // 加载配置
  async loadsetup(){
  	const fs = require('fs');
  	let setup = await this.model('setup').lists();
  	let path1 = think.getPath("common",'config');
  	if(think.isDir(think.ROOT_PATH+'/src')){
  		let data = 'export default' + JSON.stringify(setup);
  		fs.writeFileSync(think.ROOT_PATH+'/src/common/config/setup.js',data);
  	}
  	let dataBabel = "exports.__esModule = true;exports.default ="+JSON.stringify(setup);
  	fs.writeFileSync(path1+'/setup.js',dataBabel);
  	//上面这一步的做法，是因为动态添加的setup.js文件不会自动编译到app目录下，所以需要自己手动添加
  }

  async indexAction(){//加载配置
  	await this.loadsetup();
  	let id = this.get('id')||1;
  	let type = this.setup.CONFIG_GROUP_LIST;
  	let list = await this.model('setup').where({'status':1,'group':id}).field('id,name,title,extra,value,remark,type').order('sort').select();
  	if(list){
  		this.assign('list',list);
  	}
  	this.assign({
  		"meta_title":type[id]+'设置',
  		"id":id
  	})
  	this.meta_title = '网站配置';
  	return this.display();
  }

  // 显示所有配置，配置管理，添加配置
  groupAciton(){
  	this.meta_title = "配置管理";
  	return this.display();
  }


  /**
   * 配置 增删改查
   *
   */
 
  async addAction(){
  	if(this.isPost()){
  		let data = this.post();
  		data.status = 1;
  		data.update_time = new Date().valueOf();
  		let addres = this.db.add(data);
  		if(addres){
  			this.cache('setup',null);
  			await this.loadsetup();
  			return this.json(1);
  		}else{
  			return this.json(0);
  		}
  	}else{
  		this.assign({
  			'action':'/admin/setup/add'
  		});
  		this.active = '/admin/model/index';
  		this.meta_title = '新增配置';
  		return this.display();
  	}
  }
 




}