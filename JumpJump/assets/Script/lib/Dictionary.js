/**
*<code>Dictionary</code> 是一个字典型的数据存取类。
*/
//class laya.utils.Dictionary
var Dictionary=(function(){
	function Dictionary(){
		this._values=[];
		this._keys=[];
	}
	/**
	*给指定的键名设置值。
	*@param key 键名。
	*@param value 值。
	*/
	Dictionary.prototype.set=function(key,value){
		var index=this.indexOf(key);
		if (index >=0){
			this._values[index]=value;
			return;
		}
		this._keys.push(key);
		this._values.push(value);
	}

	/**
	*获取指定对象的键名索引。
	*@param key 键名对象。
	*@return 键名索引。
	*/
	Dictionary.prototype.indexOf=function(key){
		var index=this._keys.indexOf(key);
		if (index >=0)return index;
		key=((typeof key=='string'))? Number(key):(((typeof key=='number'))? key.toString():key);
		return this._keys.indexOf(key);
	}

	/**
	*返回指定键名的值。
	*@param key 键名对象。
	*@return 指定键名的值。
	*/
	Dictionary.prototype.get=function(key){
		var index=this.indexOf(key);
		return index < 0 ? null :this._values[index];
	}

	/**
	*移除指定键名的值。
	*@param key 键名对象。
	*@return 是否成功移除。
	*/
	Dictionary.prototype.remove=function(key){
		var index=this.indexOf(key);
		if (index >=0){
			this._keys.splice(index,1);
			this._values.splice(index,1);
			return true;
		}
		return false;
	}

	/**
	*清除此对象的键名列表和键值列表。
	*/
	Dictionary.prototype.clear=function(){
		this._values.length=0;
		this._keys.length=0;
	}
	Object.defineProperty(Dictionary.prototype, 'values',
	{
		get: function() {
			return this._values;
            }, 
            set: function(){},
            enumerable:false,
            configurable:true
        }
    );
	Object.defineProperty(Dictionary.prototype, 'keys',
        {
            get: function() {
                return this._keys;
            }, 
            set: function(){},
            enumerable:false,
            configurable:true
        }
    );

	return Dictionary;
})();


window.Dictionary = Dictionary;
