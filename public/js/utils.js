var utils=(function(){
    var flag="getComputedStyle" in window;
    function win(attr,val){
        if(typeof val!==undefined){
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }
        return document.documentElement[attr]||document.body[attr];
    };
    function offset(ele){
        var left=null;
        var top=null;
        var parent=ele.offsetParent;
        left=ele.offsetLeft;
        top=ele.offsetTop;
        while (parent){
            if(!flag){
                left+=parent.clientLeft;
                //console.log(parent.clientWidth);
                top+=parent.clientTop;
            }
            //console.log(parent.clientWidth);
            left+=parent.offsetLeft;
            top+=parent.offsetTop;
            parent=parent.offsetParent;
        }
        return {left:left,top:top};
    };
    function listToArray(similarArray){
        if(flag){
            var a=[];
            for (var i=0;i<similarArray.length;i++){
                a[a.length]=similarArray[i];
            }
            return a;
        }
        else{
            return Array.prototype.slice.call(similarArray);
        }
    };
    function formatJSON(str){
       return !flag?eval("("+str+")"):JSON.parse(str);
    };
    function children(ele,tagName){
        var ary=[];
        if(!flag){
            var nodeList=ele.childNodes;
            for (var i=0;i<nodeList.length;i++){
                var curNode=nodeList[i];
                curNode.nodeType===1?ary[ary.length]=curNode:null;
            }
            nodeList=null;
        }
        else {
            ary=this.listToArray(ele.children);
        }

        if(typeof tagName==="string"){

            for (var k=0;k<ary.length;k++){
                //console.log(tagName);
                if(ary[k].nodeName.toLocaleLowerCase()==tagName.toLocaleLowerCase()){
                   ary=ary.splice(k,1);
                    k--;
                }
            }
        }
        return ary;
    };
    function prev(ele){
        if(flag){
            return ele.previousElementSibling
        };
        var pre=ele.previousSibling;
        while (pre&&pre.nodeType!==1){
            pre=pre.previousSibling;
        }
        return pre;
    };
    function next(ele){
        if(flag){
            return ele.nextElementSibling;
        }
        var nex=ele.nextSibling;
        while (nex&&nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    };
    function prevAll(ele){
        var ary=[];
        var pre=this.prev(ele);
        while (pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    };
    function nextAll(ele){
        var ary=[];
        var nex=this.next(ele);
        while (nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    };
    function sibling(ele){
        var pre=this.prev(ele);
        var nex=this.next(ele);
        var ary=[];
        pre?ary.push(pre):null;
        nex?ary.push(nex):null;
        return ary;
    };
    function siblins(ele){
        return this.prevAll(ele).concat(this.nextAll(ele));
    };
    function index(ele){
        return this.prevAll(ele).length;
    };
    function firstChild(ele){
        var chs=this.children(ele);
        return chs.length>0?chs[0]:null;
    };
    function lastChild(ele){
        var chs = this.children(ele);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    };
    function append(newEle,container){
        container.appendChild(newEle);
    };
    function prepend(newEle,container){
        var fir=this.firstChild(container);
        if(fir){
            container.insertBefore(newEle,fir);
            return;
        }
        container.appendChild(newEle);
    };
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle);
    };
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    };
    function addClass(ele,cName){
        var ary=cName.replace(/^ +| +$/g,"").split(/ +/g);
       // console.log(cName.replace(/^ +| +$/g,""));
        for(var i=0;i<ary.length;i++){
            var curName=ary[i];
            if(!this.hasClass(ele,cName)){
                ele.className+=" "+curName;
            }
        }
    };
    function removeClass(ele,cName){
        var ary=cName.replace(/^ +| +$/g,"").split(/ +/g);
        for(var i=0;i<ary.length;i++){
            if(this.hasClass(ele,ary[i])){
                var reg=new RegExp("(^| +)"+ary[i]+"( +|$)","g");
                console.log(reg);
                ele.className=ele.className.replace(reg," ");
            }
        }
    };
    function hasClass(ele,cName){
        var ary=cName.replace(/^ +| +$/g,"").split(/ +/g);
        var flag=true;
        for (var i=0;i<ary.length;i++){
            var reg=new RegExp("(^| +)"+ary[i]+"( +|$)");
            flag=reg.test(ele.className);
            if(flag==false){
                break;
            }
        }
        return flag;
    };
    function getCss(attr){
        var val="";
        var reg1=/^\d+(\.\d)?(?:px|em|pt|deg|rem)?/;
        if(!flag){
            if(attr=='opacity')
            {
                var reg=/^alpha\(opacity=(\d+(\.\d+))\)$/;
                return reg.test(this.currentStyle['filter'])?RegExp.$1/100:1;
            }
            else
            {
                val=this.currentStyle[attr];
            }
        }
        else {
            val=window.getComputedStyle(this,null)[attr];
        }
        return reg1.test(val)?parseFloat(val):val;
    };
    function  getElementByClass(strClass,content){
        content=content||document;
        if(flag){
            return content.getElementsByClassName(strClass);
        }
        var strAry=strClass.replace(/(^ +| +$)/g,"").split(' ');
        var tag=content.getElementsByTagName('*');
        var ary=[];
        for (var i=0;i<tag.length;i++){
            var f=true;
            var curName=tag[i].className;
            for (k=0;k<strAry.length;k++){
                var reg=new RegExp("(^| +)"+strAry[k]+"( +|$)","g");
                f= reg.test(curName);
                if(f==false){

                    break;
                }
            }
            if(f){
                ary[ary.length]=tag[i];
            }
        }
        return ary;
    };
    function setCss(attr,value){
        if(attr==='float')
        {
            this['style']['cssFloat']=value;
            this['style']['styleFloat']=value;
            return;
        }
        if(attr==='opacity'){
            this['style']['opacity']=value;
            this['style']['filter']="alpha(opacity="+value*100+")";
            return;
        }
         var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += "px";
            }
        }
        this["style"][attr] = value;
    };
    function setGrounpCss(options){
        for(var key in options){
            if(options.hasOwnProperty(key)){
                setCss.call(this,key,options['key']);
            }
        }
    };
    function css(ele){
        var aryTwo=arguments[1],ary=Array.prototype.slice.call(arguments,1);
        if(typeof aryTwo=="string"){
            if(!arguments[2]){
                return getCss.apply(ele,ary);
            }
            setCss.apply(ele,ary);
        }
        aryTwo=aryTwo||0;
        if(aryTwo.toString()=="[object Object]"){
            setGrounpCss.apply(ele,ary);
        }
    };
    return{
        win:win,
        offset:offset,
        listToArray:listToArray,
        formatJSON:formatJSON,
        getCss:getCss,
        children:children,
        prev:prev,
        next:next,
        prevAll:prevAll,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblins,
        index:index,
        firstChild:firstChild,
        lastChild:lastChild,
        append:append,
        prepend:prepend,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        addClass:addClass,
        removeClass:removeClass,
        hasClass:hasClass,
        getClass:getCss,
        setClass:setCss,
        setGroupCss:setGrounpCss,
        css:css,
        getElementByClass:getElementByClass
    }
})();