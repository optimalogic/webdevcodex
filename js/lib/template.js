// Template replacement.
// Copyright 2022 Stephen D. Williams sdw@lig.net
// Improving on @Daniel: https://stackoverflow.com/questions/39584241/es6-string-interpolation-from-file-content/68513787#68513787

var obj = {a: 'one', b:{b1:"Bravo-1",b2:'Bravo-2'},c:{c1:{c2:"Charlie-2"}}};
var templ = '${ a}, ${b.b1 }, ${b.b2}, ${c.c1.c2}';
var templMissing = '${ a}, ${b.b1 }, ${b.b2}, ${c.c1.c2}, ${bla} ${var.ble}';

// Interpolate template given parameter object.
// Can be chained, replacing only found variable paths.
// Strip whitespace from template variable reference.
// Will not work with ${"some var"."another var"}
const replace = function (tmpl, obj) {
    return templ.replace(/\${([^}]*)}/g, (r,k)=> {
        let ret;
        try { ret = k.replace(/ /g, '').split(".").reduce((acc,cur)=>acc[cur],obj); } catch (err) { }
        return (ret === undefined) ? r : ret;
    });
};

// Interpolate template given parameter object.
// Can be chained, replacing only found variable paths.
// Will only replace ${var} if var is not undefined, but will not handle any extra whitespace: ${var} but not ${ var }.
// Will work with ${"some var"."another var"}
const replaceStrict = function (tmpl, obj) {
    return templ.replace(/\${([^}]*)}/g, (r,k)=> {
        let ret;
        try { ret = k.split(".").reduce((acc,cur)=>acc[cur],obj); } catch (err) { }
        return (ret === undefined) ? r : ret;
    });
};

// Interpolate template given parameter object.
// Assumes all referenced variables exist, and will replace all ${} or exception.
const replaceSimple = function (tmpl, obj) {
    return templ.replace(/\${([^}]*)}/g, (r,k)=> k.split(".").reduce((acc,cur)=>acc[cur],obj));
};

console.log(replace(templMissing, obj));
console.log(replaceStrict(templMissing, obj));
console.log(replaceSimple(templ, obj));

const fs = require('fs');
const replaceTest = function (file, obj) {
    fs.readFile('test.tf.template', 'utf8' , (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let content = replace(data, params);
        console.log(content);
        fs.writeFile('test.tf', content, err => {
            if (err) {
                console.error(err);
                return;
            }
            //file written successfully
        });
    });
}
