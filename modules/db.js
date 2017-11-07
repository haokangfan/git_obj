var mssql=require("mssql");
var db=require("../seting.js");
exports.selectEvery=function(tbName,obj,cb){
	var tbName=new Db(tbName,function(obj){
		obj.selectEvery(obj,function(str){
		   runSql(str,function(err,result){
//		   	console.log(err,result);
		  	  return cb(err,result);
		  });
		});
	});
//	var obj={
//		select:['userName'],
//		where:{
//			Id:2
//		}
//	}
	return;
}
exports.insertEvery=function(tbName,obj,cb){
	var tbName=new Db(tbName);
//	var obj={
//		zdName:['userName','userPassword'],
//		zdVal:['aa','bb']
//	}
	tbName.insertEvery(obj,cb);
	return;
}
exports.updateEvery=function(tbName,obj,cb){
	var tbName=new Db(tbName);
//	var obj={
//		zdName:['userName','userPassword'],
//		zdVal:['aa','bb']
//	}
	tbName.updateEvery(obj,cb);
	return;
}
exports.deleltEvery=function(tbName,obj,cb){
	var tbName=new Db(tbName);
//	var obj={
//		zdName:['userName','userPassword'],
//		zdVal:['aa','bb']
//	}
	tbName.deleltEvery(obj,cb);
	return;
}
function runSql(sql,fn){
	console.log(sql);
	var connection=new mssql.ConnectionPool(db.dburl,function(err){
		if(err){
			console.log(err+'1');
			return fn(err,null);
		}
		var ps=new mssql.PreparedStatement(connection);
		//准备
		ps.prepare(sql,function(err){
//			console.log(sql);
			if(err){
//				console.log(err+'2');
			return fn(err,null);
				
			}
			//执行
			ps.execute('',function(err,result){
				if(err){
					console.log(err+"3");
				return fn(err,null);
				}
				//完毕
				ps.unprepare(function(err){
					if(err){
						console.log(err+'4');
					return fn(err,null);
						
					}
//					console.log(result);
//					cb(err,result.recordset);
					else{
						return fn(err,result);
					}
					
				})
			})
		})
	});
}

function Db(val,fn){
	this.DbName=val;
	return fn(this);
}
//根据条件查询数据
Db.prototype.selectEvery=function(obj,fn){
	var sql="select";
	if(obj.select)
	{
//		console.log(obj.select);
		for(var i=0;i<obj.select.length;i++){
			sql+=" "+obj.select[i];
		}
		sql+=" from "+this.DbName;
	}
	else{
		sql+=" * from "+this.DbName;
	}
	if(obj.where){
		sql+=" where ";
		
		for(var key in obj.where){
			sql+=key+"='"+obj.where[key]+"' and ";
//		console.log(obj.where[key]);
		}
		sql=sql.replace(/(and |or )$/,'');
	}
//	console.log(sql);
	return fn(sql);
}
Db.prototype.insertEvery=function(obj,cb){
	var sql="INSERT INTO "+this.DbName;
	if(obj.zdName.length!==obj.zdVal.length){
		cb("字段个数不对应",null);
		return;
	}
	if(obj.zdName&&obj.zdVal){
		sql+="("+obj.zdName.join(',')+") VALUES (";
		for(var i=0;i<obj.zdVal.length;i++){
			sql+=(i==obj.zdVal.length-1)?"'"+obj.zdVal[i]+"')":"'"+obj.zdVal[i]+"',";
		}
//		for(var i=0;i<obj.zdName.length;i++){
//			sql+=(i==obj.zdName.length-1)?obj.zdName[i]+",":obj.zdName[i];
//		}
	}
//	console.log(sql);
	runSql(sql,cb);
}
Db.prototype.updateEvery=function(obj,cb){
	var sql="UPDATE "+this.DbName+" SET ";
//	console.log(sql);
	if(obj.set){
		for(var key in obj.set){
			sql+=key+"='"+obj.set[key]+"',";
		}
		sql=sql.replace(/,$/,'');
//		console.log(sql);
		if(obj.where){
			sql+=" where ";
			for(var key in obj.where){
				if(obj.bools){
					sql+=key+"='"+obj.where[key]+"' "+obj.bools+" ";
					continue;
				}
				sql+=key+"="+obj.where[key];
			}	
		}
	}
//	console.log(sql.replace(/and +$/,''));
	sql=sql.replace(/(and |or )$/,'');
//	console.log(sql);
	runSql(sql,cb);
}
Db.prototype.deleltEvery=function(obj,cb){
	var sql="DELETE FROM "+this.DbName;
	if(!obj.where){
		cb("条件不成立",null);
		return;
	}
	if(obj.where&&obj.bools){
		console.log('ok');
		sql+=" where ";
		for(var key in obj.where){
			sql+=key+"='"+obj.where[key]+"'"+obj.bools+" ";
		}
	sql=sql.replace(/(and |or )$/,'');
//	console.log(sql);
	}
//	console.log(sql);
	runSql(sql,cb);
}