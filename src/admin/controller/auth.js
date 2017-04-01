'use strict';

import Base from './base.js';
export default class extends Base {

  /**
   * 管理角色管理首页
   * @returns {*}
   */
  async adminAction() {
    let list = await this.model('auth_role').order("id ASC").select();
    this.assign({
      "datatables": true,
      "tactive": "/admin/user",
      "selfjs": "auth",
      "list":list
    })
    this.active = "admin/auth/index";
    this.meta_title = "权限管理";
    return this.display();
  }

  async roleaddAction() {
    if(this.isPost()){
      let data = this.post();
      let res = await this.model('auth_role').add(data);

      if(res){
          return this.success({ name: "添加成功！"});
      }else {
          return this.fail("添加失败！");
      }
    }else {
      return this.display();
    }
  }

  async roledelAction() {
    let id = this.param("ids");
    if(think.isEmpty(id)){
      return this.fail("参数不能为空！")
    }
    let res = await this.model('auth_role').where({id: ['IN',id]}).delete();
    if(res){
      return this.success({ name: "删除成功！"});
    }else {
      return this.fail("删除失败！");
    }
  }

  async roleeditAction(){
  	if(this.isAjax('post')){

  	}else{
  		let id = this.get('id');
  		let res = await this.model('auth_role').where({id:id}).find();
  		this.assign({
  			data:res
  		});
  		return this.display();
  	}
  }

  
  /**
   * 权限列表
   * @returns {*}
   */
  async accessAction() {
    await this.updaterules(); //更新权限节点
    // let auth_role = await this.model('auth_role').where({status:['!=' ,0],module:'admin',type:1}).field('id,desc,rule_ids').select();
    let auth_role = await this.model('auth_role').where({status:["!=",0],module :"admin",'type':1}).field('id,desc,rule_ids').select();

    console.log(auth_role);
    let this_role={};//存放该用户组的权限列表对象
    auth_role.forEach(role =>{
      if(role.id == this.get('id')){
        this_role = role;
      }
    });

    this.active = "admin/auth/index";
    this.meta_title = "权限管理";
    this.assign({
      "tactive":"/admin/user",
      "selfjs" : "auth",
      "thisid" :this.get('id'),
      "auth_role":auth_role,
      "this_role":this_role
    })
    return this.display();

  }

  async accessdataAction() {
    await this.updaterules();//更新权限节点
    let auth_role = await this.model('auth_role').where({status:["!=",0],module :"admin",'type':1}).field('id,desc,rule_ids').select();
    let node_list = await this.returnnodes();
    let map       = {module:"admin",type:['IN',[1,2]],status:1};
    let main_rules=await this.model('auth_rule').where(map).field("name,id").select();

    let this_role = {};
    auth_role.forEach(role=>{
      if(role.id==this.post("id")){
        this_role = role;
      }
    })
    let m_rules = {}
    main_rules.forEach(v=>{
      let obj = {}
       obj[v.name]=v.id;
      Object.assign(m_rules,obj)
    })
    let data = {
      "main_rules":m_rules,
      "node_list":node_list,
      "this_role":this_role
    }
    return this.json(data);
  }

  /* 通过returnnodes 获取menu表的数据，然后再获取auth_rule的数据，通过 */
  async updaterules(){
    // 需要新增的节点必然在nodes内
    let nodes = await this.returnnodes(false);
    let AuthRule = this.model('auth_rule');
    let map = {'module':'admin','type':['in',[1,2]]};

    // 需要更新和删除的节点必然在rules内
    let rules = await AuthRule.where(map).order('name').select();
    
    let data = {};//保存需要新增和更新的节点
    nodes.forEach(value => {
      let temp = {};
      temp.name = value.url;
      temp.desc = value.title;
      temp.module = 'admin';
      if(value.pid > 0){
        temp.type = 1;
      }else{
        temp.type = 2;
      }
      temp.status = 1;
      let url = temp.name + temp.module + temp.type;
      url = url.toLocaleLowerCase();
      data[url] = temp;
    });

    let update = [];//保存需要更新的节点
    let ids = [];//保存需要删除的节点id 
    let diff = {};
    rules.forEach((rule ,i) => {
      let key = rule.name + rule.module + rule.type;
      key = key.toLocaleLowerCase();
      if(!think.isEmpty(data[key])){//如果数据库中存在，说明是需要更新的节点
        data[key].id = rule.id;
        update.push(data[key]);//id name desc status module type   删除 pid condition
        delete data[key];
        delete rule.condition;
        delete rule.pid;
        diff[rule.id] = rule;
      }else{
        if(rule.status == 1){
          ids.push(rule.id);
        }
      }
    });

    // 如果有需要更新的，判断下，更新了，之所以要diff 就是要保险，
    if(!think.isEmpty(update)){
      update.forEach(row => {
        if(!isObjectValueEqual(row,diff[row.id])){
          AuthRule.where({id:row.id}).update(row);
        }
      })
    }

    if (!think.isEmpty(ids)) {
        AuthRule.where({id: ['IN', ids]}).update({'status': -1});
        //删除规则是否需要从每个用户组的访问授权表中移除该规则?
    }

    if (!think.isEmpty(data)) {
        AuthRule.addMany(obj_values(data));
    }

    return true;
  }


  

  





  
}