'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */

  init(http){
    super.init(http);
    this.db = this.model('category');
    this.tactive = "article";
  }

 /**
  * @逻辑：关于栏目的查(index)，增(add)，删，改，排序，修改状态。 
  * 
  */
  
  async indexAction(){
    let where={};
    if(this.get("mold")){
      where.mold = this.get("mold");
    }
    let tree = await this.db.gettree(0, "id,name,title,sort,pid,allow_publish,status,model,mold,isapp",where);
    this.assign("active",this.get("mold")||null);
    this.assign("list",tree);
    this.meta_title = "栏目管理";

    return this.display();
  }
  async gettreeAction(){
    let tree = await this.db.gettree(0,"id,name,title,sort,pid,allow_publish,status");
    return this.json(tree);
  }

  async addAction(){
    if(this.isPost()){
      let data = this.post();
      //表单校验
      if(parseInt(data.mold)!==2){
        if(think.isEmpty(data.model)){
          return this.fail("至少要绑定一个模型");
        }
        if(parseInt(data.mold)===0){
          if(think.isEmpty(data.type)){
            return this.fail("允许文档类型，至少要选项一个！");
          }
        }
      }
      data.status = 1;
      if(!think.isEmpty(data.name)){
        let check = await this.model("category").where({name:data.name,pid:data.pid}).find();
        if(!think.isEmpty(check)){
          return this.fail("同节点下，栏目标识不能相同");
        }
      }

      let res = await this.model("category").updates(data);
      if(res){
        this.success({name:"新增成功",url:"/admin/category/index/mold/"+data.mold});
      }else{
        this.fail("添加失败");
      }

    }else{//显示页面

      let mold = this.get('mold');
      let sortid = await this.model("typevar").getField("sortid");

      let type;
      if(!think.isEmpty(sortid)){
        sortid = unique(sortid);
        type= await this.model("type").where({typeid:['IN',sortid]}).order('displayorder ASC').select();
      }
      this.assign("typelist",type);
      //获取模型信息；
      let model;
      if(parseInt(mold)===0){
        model = await this.model("model").get_model(null,null,{extend:1});
      }else if(parseInt(mold)===1) {
        model = await this.model("model").get_model(null,null,{extend:0});
      }
      this.assign("models",model);

      //获取运行的文档类型
      this.active="admin/category/index";
      this.action = "/admin/category/add";
      //获取模版列表（pc）
      let temp_pc = await this.model("temp").gettemp(1);
      //console.log(temp_pc);
      this.assign("temp_pc",temp_pc);
      //获取手机端模版
      let temp_m = await this.model("temp").gettemp(2);
      //console.log(temp_m);
      this.assign("temp_m",temp_m);
      //template_lists
      //会员组

      let group = await this.model("member_group").order("sort ASC").select();
      this.assign('group',group);
      let role = await this.model("auth_role").order("sort ASC").select();
      this.assign('role',role);
      switch (Number(mold)){
        case 0:
          this.meta_title = "添加栏目(系统模型)"
          break;
        case 1:
          this.meta_title = "添加栏目(独立模型)"
          break;
        case 2:
          this.meta_title = "添加栏目(单页面)"
          break;
        default:
          this.meta_title = "添加栏目"
      }

      return this.display();
    }
  }
 
}




