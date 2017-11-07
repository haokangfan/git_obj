var db=require("../modules/db.js");
var fs=require('fs');
var url=require('url');
var fd=require("formidable");
var ejs=require("ejs");
var crypto=require("crypto");
function md5(str){
	var md5=crypto.createHash("md5");
	var password=md5.update(str+"hkf!!@@").digest('base64');
	return password;
}
var from = new fd.IncomingForm();
exports.selectEvery=function(req,res,next){
	var dbName="s_user";
	var username="",userpassword="";
   	from.parse(req, function (err, fields, files){
		username=fields.username;
		userpassword=fields.userpassword;
		var obj={
			select:['*'],
			where:{
				userName:username,
				userPassword:md5(userpassword)
			}
		}
		var data={
			code:'0',
			msg:"登录失败,"+(err==null)?"账号或密码错误":err,
			result:""
		};
		db.selectEvery(dbName,obj,function(err,result){
//			console.log(err,result.recordset);
			var str="";
			if(!err){
				if(result.recordset.length!=0){
					data.code="1";
					data.msg="登录成功：";
					data.result=result.recordset;
					req.session.login='1';
					req.session.username=username;
					console.log(2);
//					return res.send({status:  0 });
//					console.log(result.recordset.toString());
					str+='[{"code":"1","msg":"登录成功","result":"'+result.rowsAffected+'"}]';
				    return res.end(str);
				    return;
					
				}
				else{
					next();
				}
			}
			
			});	
		});
	}

exports.insertEvery=function(req,res,next){
	var dbName="s_user";
	var passwords=md5("");
	var obj={
		zdName:['userName','userPassword'],
		zdVal:['aa',passwords]
	}
	db.insertEvery(dbName,obj,function(err,result){
		res.send(result);
		next();
	})
}
exports.updateEvery=function(req,res,next){
	var dbName="s_user";
	var obj={
		set:{
			userName:'123123',
			userPassword:md5('abcde')
		},
		where:{
			Id:'2',
			userName:'123'
		},
		bools:"and"
	}
	db.updateEvery(dbName,obj,function(err,result){

		res.send(result.rowsAffected);
			next();
	})
}
exports.deleteEvery=function(req,res,next){
	var dbName="s_user";
	var obj={
		where:{
			Id:'2',
			userName:123123
		},
		bools:'and'
	}
//	console.log('ok0');
	db.deleltEvery(dbName,obj,function(err,result){
		res.send(result.rowsAffected);
		next();
	})
}
exports.login=function(req,res){
	res.render("login",{goLogin:""});
	return;
}
exports.index=function(req,res){
//	res.render("index");
	if(req.session.login=='1'){
		res.render("index");
		return;
	}
	else{		
		res.render("login",{
			goLogin:"请先登录"
	});
		return;
  }
	return;
}
exports.signin=function(req,res){
	res.render("signin");
	return;
}
exports.dosignin=function(req,res){
	from.parse(req, function (err, fields, files){
		var dbName="s_user";
		var username=fields.username,
		    passwords=md5(fields.passwrod),
		    name=fields.name,
		    IDcard=fields.IDcard;
		    console.log(username,fields.passwrod,name,IDcard);
		var obj={
			zdName:['userName','userPassword','name','IDcard'],
			zdVal:[username,passwords,name,IDcard]
		}
		var data={
			code:'0',
			msg:"登录失败,"+(err==null)?"账号或密码错误":err,
			result:""
		};
		db.insertEvery(dbName,obj,function(err,result){
		 if(!err){
		 	if(result.rowsAffected.length!=0){
		 		data={
					code:'1',
					msg:"注册成功",
					result:result
				};
		 	}
		 }
		 res.send(data);
			return;
		})
	})
}
exports.getData=function(req,res){
		var obj={
			select:['*'],
		}
		var data={
			code:'0',
			msg:"没有数据,"+(err==null)?"账号或密码错误":err,
			result:""
		};
		db.selectEvery(dbName,obj,function(err,result){
			console.log(err,result);
			if(!err){
				if(result.recordset.length!=0){
					data.code="1";
					data.msg="成功";
					data.result=result.recordset;
					return res.send(data);
					
				}
			
			};	
		});
	}


