/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 * 
 * global.fn1 = function(){
 *     
 * }
 */


 /**
 * in_array
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */
/* global in_array */
global.in_array = function(stringToSearch, arrayToSearch) {
  for (let s = 0; s < arrayToSearch.length; s++) {
    let thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

/**
 * 排序函数
 */
function sort_node(v, w) {
  return v["sort"] - w["sort"];
}
function sort_node1(v, w) {
  return w["sort"] - v["sort"];
}
/**
 * global get_children
 * 获取子集分类 （这里是获取所有子集）
 */
global.get_children = function(nodes, parent , sn=0) {
  var children = [];
  var last = [];
  /* 未访问的节点 */
  /*
   * 获取根分类列表。
   * 创建一个虚拟父级分类亦可
   **/
  var node = null;
  for (var i in nodes) {
    node = nodes[i];
    if (node["pid"] == parent) {
      node["deep"] = 0;
      children.push(node);
    } else {
      last.push(node);
    }
  }
  if(sn==0){
    children.sort(sort_node);
  }else {
    children.sort(sort_node1);
  }


  /* 同级排序 */
  var jumper = 0;
  var stack = children.slice(0);
  /* easy clone */

  while (stack.length > 0
    /* just in case */ && jumper++ < 1000) {
    var shift_node = stack.shift();
    var list = [];
    /* 当前子节点列表 */
    var last_static = last.slice(0);
    last = [];
    for (var i in last_static) {
      node = last_static[i];
      if (node["pid"] == shift_node["id"]) {
        node["deep"] = shift_node["deep"] + 1;
        list.push(node);
      } else {
        last.push(node);
      }
    }
    if(sn==0){
      list.sort(sort_node);
    }else {
      list.sort(sort_node1);
    }


    for (var i in list) {
      node = list[i];
      stack.push(node);
      children.push(node);
    }
  }
  /*
   * 有序树非递归前序遍历
   *
   * */
  var stack = [];
  /* 前序操作栈 - 分类编号 */
  var top = null;
  /* 操作栈顶 */
  var tree = children.slice(0);
  /* 未在前序操作栈内弹出的节点 */
  var has_child = false;
  /* 是否有子节点，如无子节点则弹出栈顶 */
  var children = [];
  /* 清空结果集 */
  var jumper = 0;
  last = [];
  /* 未遍历的节点 */
  var current = null;
  /* 当前节点 */
  stack.push(parent);
  /* 建立根节点 */

  while (stack.length > 0) {
    if (jumper++ > 1000) {
      break;
    }
    top = stack[stack.length - 1];
    has_child = false;
    last = [];

    for (var i in tree) {
      current = tree[i];
      if (current["pid"] == top) {
        top = current["id"];
        stack.push(top);
        children.push(current);
        has_child = true;
      } else {
        last.push(current);
      }
    }
    tree = last.slice(0);
    if (!has_child) {
      stack.pop();
      top = stack[stack.length - 1];
    }
  }
  return children;
}

/**
 * 判断对象是否相等
 * @param a
 * @param b
 * @returns {boolean}
 */
/* global isObjectValueEqual */
	global.isObjectValueEqual = function(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
          return false;
      }
    }
    return true;
	}

  /**
   * obj_values(obj);
   * 获取对象中的所有的值，并返回数组
   * @param obj
   * @returns {Array}
   */
  /* global obj_values */
  global.obj_values = function(obj) {
    let objkey = Object.keys(obj);
    let objarr = [];
    objkey.forEach(key => {
        objarr.push(obj[key]);
    })
    return objarr;
  }


  /**
   * 密码加密
   * @param password 加密的密码
   * @param md5 true-密码不加密，默认加密
   * @returns {*}
   */
  /*global encryptPassword */
  global.encryptPassword = function(password, md5encode) {
    md5encode = md5encode || false;
    password = md5encode ? password : think.md5(password);
    return think.md5(think.md5('www.doujiao.com') + password + think.md5('pengpeng'));
  }

  /**
  * ip转数字
  * @param ip
  * @returns {number}
  * @private
  */
  /* global _ip2int(ip)*/
  global._ip2int = function(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
  }
  /**
  * 数字转ip
  * @param num
  * @returns {string|*}
  * @private
  */
  /*global _int2ip(num: number) */
  global._int2iP = function(num) {
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
  }

  /**
   * 把返回的数据集转换成Tree
   * @param array data 要转换的数据集
   * @param string pid parent标记字段
   * @return array
   */
  /* global arr_to_tree */
  global.arr_to_tree = function(data, pid) {
    var result = [], temp;
    var length=data.length;
    for(var i=0;i<length;i++) {
      if (data[i].pid == pid) {
        result.push(data[i]);
        temp = arr_to_tree(data, data[i].id);
        if (temp.length > 0) {
          data[i].children = temp;
          data[i].chnum =data[i].children.length
        }
      }
    }
    return result;
  }

 /**
  * @param array 将传入数组array去重
  */
  global.unique = function(array){
    return Array.from(new Set(array));
  }
  