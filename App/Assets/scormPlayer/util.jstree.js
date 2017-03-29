
UtilTree = function(formNm, treeId, jsonUrl, maxDepth, plugins, ajaxOpt, jsonData) {
	this.treeId = treeId;
	this.formNm = formNm;
	this.jsonUrl = jsonUrl;
	this.maxDepth = (maxDepth)? maxDepth : -1;
	this.theme = "classic";
	this.plugins = plugins;
	this.ajaxOpt = ajaxOpt;
	this.jsonData = jsonData;
};

/**
 * data.inst - node 의 jstree 객체 인스턴스 (the actual tree instance)
 * data.args - (arguments passed to the function)
 * data.rslt - (any data the function passed to the event)
 * data.rlbk - (an optional rollback object - it is not always present)
 * 
 * data.rslt.obj : node 객체
 * 
 * plugins ui - select_node.jstree
 * 
 */
UtilTree.prototype = {
	init : function(create, remove, select, loaded){
		var formNm = this.formNm;
		var mytree = $("#"+this.treeId);
		var jsonUrl = this.jsonUrl;
		var ajaxOpt = this.ajaxOpt;
		var jsonData = this.jsonData;
		
		var defaultPlugins = [ "themes", "json_data", "types", "ui"];
		if(this.plugins){
			for(var index in this.plugins){
				defaultPlugins.push(this.plugins[index]);
			}
		}
		var option = {
				core : { strings : { loading : "Loading ...", new_node : "New" }, animation : 100 },
				types : {max_depth : this.maxDepth},
				plugins: defaultPlugins,
				contextmenu : { items : { ccp : false, rename : false } }
			};
		
		if(isNotEmpty(jsonUrl)) {
			$.extend(option, {json_data : {ajax : {
				type : "post",
				url : jsonUrl,
				data : function(node){
					param = $("form[name='"+formNm+"']").serializeArray();
					if(ajaxOpt){
						var json = mytree.jstree("get_json", node);
						var upperId = json[0].metadata[ajaxOpt.idColumn];
						param.push({'name':ajaxOpt.searchColumn, 'value': upperId});
					}
					return param;
				},
				success : function(data, status, xhr,auto){
                	return data.result.json;
                }
			}}});
		}
		else if(isNotEmpty(jsonData)){
			$.extend(option, {json_data : {data : jsonData}});
		}
		
		mytree.jstree(option)
			.bind("loaded.jstree", function (e, data) {
				if(loaded != null){
					if($.isFunction(loaded)){
						loaded(data);
					}
					else{
						eval(loaded + '(data);');
					}
				}
			})		
			.bind("refresh.jstree", function (e, data) {
				mytree.jstree("open_all", -1);
			})
			.bind("create.jstree", function (e, data) {
				if(create != null){
					if($.isFunction(create)){
						create(data);
					}
					else{
						eval(create + '(data);');
					}
				}				
			})
			.bind("remove.jstree", function (e, data) {
				if(remove != null){
					if($.isFunction(remove)){
						remove(data);
					}
					else{
						eval(remove + '(data);');
					}
				}
			})
			.bind("select_node.jstree", function (e, data) {
				if(select != null){
					if($.isFunction(select)){
						select(data);
					}
					else{
						eval(select + '(data);');
					}
				}				
			});
	},
	isRoot : function(data){
		return (data.inst._get_parent(data.rslt.obj) == -1)? true : false;
	},
	createRoot : function(title){
		$("#"+this.treeId).jstree("create", -1, false, title ,false, false);
	},
	getData : function(data, key){
		return data.rslt.obj.data(key);
	},
	setData : function(data, param){
		data.rslt.obj.data(param);
	},
	getParentData : function(data, key){
		var parent = data.inst._get_parent(data.rslt.obj);
		return parent.data(key);
	},
	getParent : function(node){
		return $.jstree._reference("#"+this.treeId)._get_parent(node);
	},
	getText : function(data){
		return data.rslt.obj.text();
	},
	getLevel : function(data){
		return data.inst.get_path(data.rslt.obj, false).length;
	},
	selectNode : function(){
		return $("#"+this.treeId).jstree("get_selected");
	},
	getJson : function(node, field){
		var json = $("#"+this.treeId).jstree("get_json", node);
		if(field){
			return json[0].metadata[field];
		}
		else{
			return json;
		}
	},
	deleteNode : function(data){
		data.inst.delete_node(data.rslt.obj);
	},
	refresh : function(){
		$("#"+this.treeId).jstree("refresh");
	},
	rollback : function(data){
		$.jstree.rollback(data.rlbk);
	},
	saveSelected : function(data){
		$("#"+this.treeId).jstree("save_selected");
	},
	openAll : function(){
		$("#"+this.treeId).jstree("open_all", -1);
	},
	closeAll : function(){
		$("#"+this.treeId).jstree("close_all", -1);
	}
};