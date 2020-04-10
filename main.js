var n, k, m;
var gr;

var ind_example = 0;

var examples = [[3, 4, 5, 1, 1, 1,2, 2,3, 3,3, 2,4], [5, 5, 6, 1, 2, 1, 1, 3, 2, 4, 1, 5, 1, 5, 4]];

var data;
var s = null;

var base_node_color = '#C6E746';
var base_edge_color = '#528CE0';
var EDGE_STEP = 5;

var MAXN = 20;

var COEF = 10000;

var coor1 = null;
var coor2 = null;

var used1 = null;
var used2 = null;

function read(arr = []) {
    if (arr.length == 0) {
        var str = document.getElementById("input").value;
        var arr = str.split(/\s+/);
    }
    n = Number(arr[0]);
    k = Number(arr[1]);
    m = Number(arr[2]);
    coor1 = new Array(n + 1);
    coor2 = new Array(k + 1);

    used = new Array(n + 1);
    used1 = new Array(n + 1);
    used2 = new Array(k + 1);
    for (var i = 0; i <= n; i++) {
        used1[i] = 0;
        used[i] = 0;
    }
    for (var i = 0; i <= k; i++) {
        used2[i] = 0;
    }
    gr = new Array(n + 1);
    for (var i = 0; i <= n; i++) {
        gr[i] = [];
    }
    for (var i = 3; i < arr.length; i+= 2) {
        gr[arr[i]].push(arr[i + 1]);
    }
    mt = new Array(k + 1);
    for (var i = 1; i <= k; ++i) {
        mt[i] = -1;
    }
}

function get_label_n(par) {
    return "n" + par.toString();
}

function get_label_k(par) {
    return "k" + par.toString();
}

function get_label_edge(a, b) {
    return "e" + a.toString() + "_" + b.toString();
}

function createTable(index = [], a=[]) {
    if (a.length == 0) {
        a = new Array(k + 1);
        for (var i = 1; i <= k; ++i) {
            a[i] = -1;
        }
    }
    var theader = '<table border="1">\n';
    var tbody = '';

    tbody += '<tr>';
    tbody += '<th>' + 'pair[v]' + '</th>';
    tbody += '<th>' + 'v' + '</th>';
    tbody += '</tr>\n';
    for( var i=1; i<=k;i++) {
        var flag = 0;
        for (var j = 0; j < index.length; ++j) {
            if (i == index[j]) {
                flag = 1;
            }
        }
        if (flag) {
            tbody += '<tr bgcolor="#b8860b">';
        } else {
            tbody += '<tr bgcolor="#ffe4c4">';
        }

        tbody += '<td>' + a[i] + '</td>';
        tbody += '<td>' + i + '</td>';

        tbody += '</tr>\n';
    }
    var tfooter = '</table>';
    document.getElementById('mt-section').innerHTML = theader + tbody + tfooter;
}

function refresh_graph() {
    if (used1 != null) {
        for (var i = 0; i <= n; i++) {
            used1[i] = 0;
        }
        for (var i = 0; i <= k; i++) {
            used2[i] = 0;
        }
    }
    if (s != null) {
        s.graph.clear();
        s.refresh();
    }
}

function refresh_messages_and_table() {
    document.getElementById('code').innerHTML = "";
    document.getElementById('mt-section').innerHTML = "";
    ind = 0;
    if (states.data.length != 0) {
        states.data = [];
    }
    if (states.message.length != 0) {
        states.message = [];
    }
    if (states.color.length != 0) {
        states.color = [];
    }
}


function change_node_color(v, first, current_color) {
    var data2 = {
        nodes: [],
        edges: []
    };
    data2.edges = data.edges;
    for (var j = 0; j < data.nodes.length; j++) {
        var flag = 0;
        if (first) {
            if (data.nodes[j].id == get_label_n(v)) {
                flag = 1;
                data2.nodes.push({
                    "id": get_label_n(v),
                    "label": v.toString(),
                    "x": 1,
                    "y": coor1[v],
                    "size": 2,
                    "color": current_color
                });
            } else {
                for (var i = -EDGE_STEP; i <= EDGE_STEP; i++) {
                    var c = v * COEF + i;
                    if (data.nodes[j].id == get_label_n(c)) {
                        flag = 1;
                        data2.nodes.push({
                            "id": get_label_n(c),
                            "label": c.toString(),
                            "x": 1,
                            "y": coor1[v] + i * 0.001,
                            "size": 0.001,
                            "color": current_color
                        });
                    }
                }
            }
        } else if (!first) {
            if (data.nodes[j].id == get_label_k(v)) {
                flag = 1;
                data2.nodes.push({
                    "id": get_label_k(v),
                    "label": v.toString(),
                    "x": 3,
                    "y": coor2[v],
                    "size": 2,
                    "color": current_color
                });
            } else {
                for (var i = -EDGE_STEP; i <= EDGE_STEP; i++) {
                    var d = v * (-COEF) + i;
                    if (data.nodes[j].id == get_label_k(d)) {
                        flag = 1;
                        data2.nodes.push({
                            "id": get_label_k(d),
                            "label": d.toString(),
                            "x": 3,
                            "y": coor2[v] + i * 0.001,
                            "size": 0.001,
                            "color": current_color
                        });
                    }
                }
            }
        }
        if (!flag) {
            data2.nodes.push(data.nodes[j]);
        }
    }
    data = data2;
}

function change_edge_color(from, to, current_color) {
    var data2 = {
        nodes: [],
        edges: []
    };
    data2.nodes = data.nodes;
    for (var j = 0; j < data.edges.length; j++) {
        var flag = 0;
        for (var i = -EDGE_STEP; i <= EDGE_STEP; i++) {
            var c = from * COEF + i;
            var d = to * (-COEF) + i;
            if (data.edges[j].id == get_label_edge(c, d)) {
                flag = 1;
                data2.edges.push({
                    "id": get_label_edge(c, d),
                    "source": get_label_n(c),
                    "target": get_label_k(d),
                    "color": current_color
                });
            }
        }
        if (flag == 0) {
            data2.edges.push(data.edges[j]);
        }
    }
    data = data2;
}

function add_thin_edge(from, to, current_color) {
    for (var i = -EDGE_STEP; i <= EDGE_STEP; i++) {
        // if (i != 0) {
            var c = from * COEF + i;
            var d = to * (-COEF) + i;
            if (used1[from] == 0) {
                data.nodes.push({
                    "id": get_label_n(c),
                    "label": c.toString(),
                    "x": 1,
                    "y": coor1[from] + i * 0.001,
                    "size": 0.01,
                    "color": '#C6E746'
                });
            }
            if (used2[to] == 0) {
                data.nodes.push({
                    "id": get_label_k(d),
                    "label": d.toString(),
                    "x": 3,
                    "y": coor2[to] + i * 0.001,
                    "size": 0.01,
                    "color": '#C6E746'
                });
            }
            data.edges.push({
                "id": get_label_edge(c, d),
                "source": get_label_n(c),
                "target": get_label_k(d),
                "color": current_color
            });
        // }
    }
    used1[from] = 1;
    used2[to] = 1;
}

function fill_by_example() {
    ind_example = (ind_example + 1) % examples.length;
    var arr = examples[ind_example].slice();
    read(arr);
}

function get_data() {
    data = {
        nodes: [],
        edges: []
    };
    var ny = 1;
    var ky = 1;
    if (n > k) {
        ky += (n - k) / 2;
    } else if (n < k) {
        ny += (k - n) / 2;
    }
    for (var i = 1; i <= k; i++) {
        coor2[i] = ky;
        data.nodes.push({"id": get_label_k(i), "label" : i.toString(), "x" : 3, "y" : ky++, "size": 2,
        "color": base_node_color});
    }
    for (var i = 1; i <= n; i++) {
        var kek = 0;
        coor1[i] = ny;
        data.nodes.push({"id": get_label_n(i), "label" : i.toString(), "x" : 1, "y" : ny++, "size": 2,
        "color": base_node_color});
        for (var j = 0; j < gr[i].length; j++) {
            var to = gr[i][j];
            add_thin_edge(i, to,base_edge_color);
        }
    }
    s = new sigma({
        graph : data,
        container : 'container',
        // settings: {
        //     defaultNodeColor: '#C6E746'
        // }
    });
    s.refresh();
    go_kuhn();
}