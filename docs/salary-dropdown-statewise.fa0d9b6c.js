parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"gMAi":[function(require,module,exports) {
module.exports="salaries-statewise.6aa6885b.csv";
},{}],"mCU8":[function(require,module,exports) {
var t=["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"];d3.csv(require("/data/salaries-statewise.csv"),function(e,n){var r={};n.forEach(function(a){var e=a.states;r[e]=[],t.forEach(function(t){r[e].push(+a[t])})}),a(r)});var a=function(a){var e=30,n=30,r=30,s=30,l=800-s-n,i=600-e-r,o=d3.scale.ordinal().domain(t).rangeRoundBands([0,l],.1),c=d3.scale.linear().domain([-20,30]).range([i,0]);console.log(o(30));var d=d3.select("#my_dataviz").append("svg").attr("width",l+s+n).attr("height",i+e+r).append("g").attr("transform","translate("+s+","+e+")"),u=d3.svg.axis().scale(o).orient("bottom");d.append("g").attr("class","x axis").attr("transform","translate(0,"+c(0)+")").call(u).selectAll("text").style("text-anchor","middle").style("alignment-baseline","start").style("font-size",10);var f=d3.svg.axis().scale(c).orient("left"),v=d.append("g").attr("class","y axis").call(f).selectAll("text").style("text-anchor","end").style("alignment-baseline","start").style("font-size",10);v.append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end").style("font-size",10).text("Percent change");var h=function(a){v.call(f);var e=d.selectAll(".bar").data(a);e.enter().append("rect").attr("class","bar").attr("x",function(a,e){return o(t[e])}).attr("width",o.rangeBand()).attr("y",function(t,a){return c(t<0?0:t)}).attr("height",function(t,a){return Math.abs(c(t)-c(0))}),e.transition().duration(250).attr("y",function(t,a){return c(t<0?0:t)}).attr("height",function(t,a){return Math.abs(c(t)-c(0))}),e.exit().remove()},p=Object.keys(a).sort();d3.select("#my_dataviz").insert("select","svg").on("change",function(){var t=d3.select(this).property("value"),e=a[t];h(e)}).selectAll("option").data(p).enter().append("option").attr("value",function(t){return t}).text(function(t){return t});var g=a[p[0]];h(g)};
},{"/data/salaries-statewise.csv":"gMAi"}]},{},["mCU8"], null)
//# sourceMappingURL=salary-dropdown-statewise.fa0d9b6c.js.map