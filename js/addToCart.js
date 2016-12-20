'use strict';

var typeList = {}; //所有商品规格
var typeSel = {}; // 选择的商品规格ID
var subGoodNo = ''; //goodsNumber
var goodsAttribute = ''; // 已选择商品的描述
var goodsNoList = {}; // 以goodesNumber 为key的对象
var goodType = {}; // 商品规格名称
var num = 0; //
var iType = ''; //
var aGoodIds = []; // 已选商品id
var allSortItem = {}; //要提交的数据对象

var oGoodsImg = document.getElementById('goodsImg'); // 商品图片
var oPrice = document.querySelector('.price'); // 商品价格
var oHasStock = document.querySelector('.hasStock'); // 商品库存
var oType = document.querySelector('.type'); // 全部商品类型
var oSelectType = document.querySelector('.select-type'); // 已选择商品类型

var oTotal = document.getElementById('total'); // 选择的数量
var aTurl = document.getElementById('url').value; // 载入类型 ？
var oGoodsImgSrc = document.getElementById('imgUrl').value; // 商品图片路径

oGoodsImg.src = oGoodsImgSrc; // 图片URL地址

var oMinus = document.querySelector('.minus'); // 数量减按钮
var oPlus = document.querySelector('.plus'); // 数量加按钮

// 判断手机内核
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

// 产品规格数组
var jsonStr = result.goods.jsonStr;

oPrice.innerHTML = '￥' + jsonStr[0].price; // 设置商品价格
oHasStock.innerHTML = result.goods.surplusQuantity; // 设置商品库存

// 商品规格 / 请选择商品类型
for (var i = 0; i < jsonStr.length; i++) {
    for (var k = 0; k < jsonStr[i].format.length; k++) {
        var type = jsonStr[i].format[k];
        type.stock = jsonStr[i].stock;
        type.price = jsonStr[i].price;
        type.hasStock = jsonStr[i].hasStock;
        type.goodsNo = jsonStr[i].goodsNo;

        if (typeList[type.name]) {
            if (!findInArr(typeList[type.name], type.id)) typeList[type.name].push(type);
        } else {
            goodType[type.name] = '';
            iType += type.name + '/';
            typeSel[num] = '';
            typeList[type.name] = [];
            typeList[type.name].push(type);
            num++;
        }
    }
    goodsNoList[type.goodsNo] = jsonStr[i].format
}

oType.innerHTML = '请选择' + iType.substring(0, iType.lastIndexOf('/')); // 添加商品规格类型

// 遍历所有规格 数组全排序
for (var i = 0; i < jsonStr.length; i++) {
    var allSort = permute(jsonStr[i].format);
    for (var k = 0; k < allSort.length; k++) {
        var groupId = '';
        for (var j = 0; j < allSort[k].length; j++) {
            groupId += allSort[k][j].id;
        }
        allSortItem[groupId] = {
            goodsNo: allSort[k][0].goodsNo,
            stock: allSort[k][0].stock,
            hasStock: allSort[k][0].hasStock,
            price: allSort[k][0].price
        };
    }
}

var index = 0;
// 添加所有规格
for (var name in typeList) {
    var typeNode = $('<dl></dl>').appendTo($('.dynamic-norms'));
    $('<dt>' + name + '</dt>').appendTo($(typeNode));
    var aTypeList = $('<dd></dd>').appendTo($(typeNode));
    for (var i = 0; i < typeList[name].length; i++) {
        ;(function (el, index) {
            var aNodes = $('<a href="javascript:;" id="' + typeList[name][i].id + '">'
                + typeList[name][i].text + '</a>').bind('click', function () {
                nodeSearch(el, index, this);
            }).appendTo(aTypeList);

            // 如果是单规格 库存为0的添加状态
            if (num == 1 && typeList[name][i].hasStock == 0) $(aNodes).addClass('empty');
        })(typeList[name][i], index);
    }
    index++;
}

// 规格点击
function nodeSearch(el, index, _this) {

    // 当前元素库存为0或者当前状态为已选择 不再往下执行
    if ($(_this).hasClass('empty') || $(_this).hasClass('active')) return;
    if (num > 1) $('.dynamic-norms dl a').removeClass('empty');

    $(_this).closest('dl').find('a').removeClass('active');
    $(_this).addClass('active');

    var elId = el.id;
    typeSel[index] = elId;
    var currentId = '';
    var degree = 0; // 当前选择的是第几类规格

    goodType[el.name] = el.text;

    oSelectType.innerHTML = '';
    for (var item in goodType) {
        if (goodType[item] != '') $('<span class="format">' + item + '：<i>'
            + goodType[item] + '</i></span>').appendTo($(oSelectType));
    }

    // ID组合
    aGoodIds = [];
    for (var item in typeSel) {
        if (typeSel[item] != '') {
            currentId += typeSel[item];
            degree++;
        }
        aGoodIds.push(typeSel[item]);
    }

    // 组合搜索
    var reg = eval('/^' + currentId + '/i');

    for (var item in allSortItem) {
        if (degree == num && item == currentId) {
            oHasStock.innerHTML = allSortItem[item].hasStock;
            oPrice.innerHTML = '￥' + allSortItem[item].price;
            subGoodNo = allSortItem[item].goodsNo;

            goodsAttribute = '';
            for (var s = 0; s < goodsNoList[subGoodNo].length; s++) {
                var qType = goodsNoList[subGoodNo][s];
                goodsAttribute += qType.name + ':' + qType.text + '  ';
            }

            oTotal.innerHTML = 1;
            nextFind(aGoodIds.length);
        } else {
            if (degree == num - 1 && reg.test(item)) {
                var surplusId = item.replace(reg, '');
                if (allSortItem[item].hasStock == 0) $('#' + surplusId).addClass('empty');
            }
        }
    }
}

// 购买数量减
oMinus.addEventListener('click', function () {
    var numVal = oTotal.innerHTML;
    if (!isNaN(numVal) && numVal > 1) {
        numVal--;
        oTotal.innerHTML = numVal;
    }
}, false);

// 购买数量加
oPlus.addEventListener('click', function () {
    var maxHasStock = oHasStock.innerHTML;
    var numVal = oTotal.innerHTML;
    if (numVal <= maxHasStock - 1) {
        numVal++;
        oTotal.innerHTML = numVal;
    } else {
        alert('超过最大库存');
    }
}, false);

// 添加到购物车或立即购买
document.getElementById('submilt').addEventListener('click', function () {

    if (subGoodNo.length == 0) {
        alert('您有未选择的规格');
        return;
    }
    console.log(goodsAttribute);
});

// 匹配符合的数据
function nextFind(n) {
    var iPermuteId = [];
    n--;
    if (n >= 0) {
        nextFind(n);
        for (var i = 0; i < aGoodIds.length; i++) {
            if (i != n) {
                iPermuteId.push(aGoodIds[i]);
            }
        }
        var aPermuteIds = permute(iPermuteId);

        for (var z = 0; z < aPermuteIds.length; z++) {
            var normalId = '';
            for (var w = 0; w < aPermuteIds[z].length; w++) {
                normalId += aPermuteIds[z][w];
            }
            for (var items in allSortItem) {
                if (items.indexOf(normalId) != -1) {
                    if (allSortItem[items].hasStock == '0') {
                        var emptyId = items.substring(0, items.indexOf(normalId));
                        $('#' + emptyId).addClass('empty');
                    }
                }
            }
        }
    }
}

// 数组全排序
function permute(input) {
    var permArr = [],
        usedChars = [];

    function main(input) {
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);

            if (input.length == 0) {
                permArr.push(usedChars.slice());
            }
            main(input);
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr
    }

    return main(input);
}

// 查找元素是否存在
function findInArr(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return true
        }
    }
    return false;
}

