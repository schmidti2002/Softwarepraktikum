/* C example Code:
    int x=1;
    if(x == 1){
        x += 5;
        x *= 5;
    }else{
        x += 1;
    }
    push(x);
*/

var state = {
    vars: {}, line: 0
}

/*lines = [
    {f: function(s){s.vars.x = 1; return s;}},
    {f: function(s){if(s.vars.x === 1)s.line="else_x"; return s;}},
    {f: function(s){s.vars.x += 5; return s;}},
    {f: function(s){s.vars.x *= 5; return s;}},
    {l: "else_x", f: function(s){s.line += 2; return s;}},
    {f: function(s){s.vars.x += 1; return s;}},
    {},
    {f: function(s){alert(s.vars.x); return s;}},
];*/


state.vars.arr = [];

let lines = [
    { f: function (s) { s.vars.n = state.vars.arr.length; return s; } },
    { f: function (s) { s.vars.i = 0; return s; } },
    { f: function (s) { return { ...s, condition: s.vars.i < s.vars.n - 1 }; } },
    { l: "outer_loop", f: function (s) { return { ...s, line: "inner_loop", vars: { k: 0 } }; } },
    { f: function (s) { return { ...s, condition: s.vars.k < n - 1 - s.vars.i }; } },
    { l: "inner_loop", f: function (s) { return { ...s, condition: s.vars.arr[s.vars.k] > s.vars.arr[s.vars.k + 1] }; } },
    { f: function (s) { return { ...s, line: "swap", vars: { temp: s.vars.arr[s.vars.k] } }; } },
    { l: "swap", f: function (s) { return { ...s, line: "swap_2", vars: { arr: [...s.vars.arr], [s.vars.k]: s.vars.arr[s.vars.k + 1], [s.vars.k + 1]: s.vars.temp } }; } },
    { l: "swap_2", f: function (s) { return { ...s, line: "showOutput" }; } },
    { l: "showOutput", f: function (s) { return { ...s, line: "increment_k", f: "zeigeAusgabe" }; } },
    { l: "increment_k", f: function (s) { return { ...s, vars: { k: s.vars.k + 1 } }; } },
    { l: "else_inner_loop", f: function (s) { return { ...s, line: "else_inner_loop_2", vars: { i: s.vars.i + 1 } }; } },
    { l: "else_inner_loop_2", f: function (s) { return { ...s, line: "else_outer_loop" }; } },
    { l: "else_outer_loop", f: function (s) { return { ...s, line: "increment_i", vars: { i: s.vars.i + 1 } }; } },
    { l: "increment_i", f: function (s) { return { ...s, vars: { i: s.vars.i + 1 } }; } },
    { f: function (s) { return { ...s, line: "showResult" }; } },
    { l: "showResult", f: function (s) { return { ...s, f: "alert", args: [s.vars.x] }; } },
    {}
];

function step(){
    var old_l = state.line;
    var f = lines[state.line].f;
    if(f){
        state = f(state);
        console.log(JSON.stringify(state));
    }
    if(old_l === state.line){
        state.line += 1;
    }else if(typeof state.line === "string"){
        for (let i = 0; i < lines.length; i++) {
            if(lines[i].l === state.line){
                state.line = i;
                break;
            }
        }
    }
};

while(state.line !== lines.length){
    step();
}

