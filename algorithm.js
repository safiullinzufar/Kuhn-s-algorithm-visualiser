var states = {
    data: [],
    message: [],
    color:[]
};
var ind = 0;

var used = null;
var mt = null;

var online_node_color = '#ff1493';
var online_edge_color = '#710909';

function add_only_msg(msg) {
    states.data.push(data);
    states.message.push(msg);
    var newArray = mt.slice();
    states.color.push([[], newArray]);
}

function push_state(msg, index) {
    states.data.push(data);
    states.message.push(msg);
    var newArray = mt.slice();
    states.color.push([[index], newArray]);
}

function push_state_multi(msg, index) {
    states.data.push(data);
    states.message.push(msg);
    var newArray = mt.slice();
    states.color.push([index, newArray]);
}

function change_and_push_state(v, to, cur_color, msg = '', index=-1) {
    change_edge_color(v, to, cur_color);
    push_state(msg, index);
}

function try_kuhn (v, parent = -1) {
    console.log("enter ", v);
    if (used[v]) {
        console.log("already used exit ", v);
        return 0;
    }
    used[v] = 1;
    for (var i = 0; i < gr[v].length; i++) {
        var to = gr[v][i];
        if (to == parent) {
            continue;
        }
        change_node_color(to, 0, online_node_color);
        if (mt[to] == -1) {
            change_and_push_state(v, to, online_edge_color, 'Для вершины ' + to.toString() +
                ' из правой доли нет инцидентной вершины из левой доли, поэтому добавляем ребро (' + v.toString()
                + ", " + to.toString() + ") в паросочетание.", to);
        } else {
            change_and_push_state(v, to, online_edge_color, 'Вершине ' + to.toString() + ' уже инцидентна вершина '
                + mt[to].toString(), to);
        }
        if (mt[to] == -1) {
            mt[to] = v;
            change_node_color(to, 0, base_node_color);
            change_and_push_state(v, to, base_edge_color, 'Откатываемся назад из дерева рекурсии.');
            console.log("exit ", v);
            return 1;
        }
        change_node_color(mt[to], 1, online_node_color); // mt[to] node color
        change_and_push_state(mt[to], to, online_edge_color, 'Попытаемся найти увеличивающую цепь от вершины ' + mt[to].toString() + '.'); // add mt[to] - to

        if (try_kuhn (mt[to], to)) {
            change_node_color(mt[to], 1, base_node_color);
            change_and_push_state(mt[to], to, base_edge_color, 'Откатываемся назад из дерева рекурсии.');

            change_node_color(to, 0, base_node_color);
            change_and_push_state(v, to, base_edge_color, 'Откатываемся назад из дерева рекурсии.');
            mt[to] = v;
            return 1;
        }
        change_node_color(mt[to], 1, base_node_color);
        change_and_push_state(mt[to], to, base_edge_color, 'Откатываемся назад из дерева рекурсии.');

        change_node_color(to, 0, base_node_color);
        change_and_push_state(v, to, base_edge_color, 'Откатываемся назад из дерева рекурсии.');
    }
    console.log("exit ", v);
    return 0;
}

function go_kuhn() {
    for (var v = 1; v <= n; v++) {
        for (var i = 1; i <= n; i++) {
            used[i] = 0;
        }
        change_node_color(v, 1, online_node_color);
        if (gr[v].length == 0) {
            add_only_msg("Из вершины " + v.toString() + ' не выходит ни одного ребра.');
        } else {
            add_only_msg("Запускаем DFS из вершины " + v.toString() + '.');
        }
        try_kuhn(v);
        change_node_color(v, 1, base_node_color);
    }
    var all_matchings = '';
    index = [];
    for (var v = 1; v <= k; ++v) {
        if (mt[v] != -1) {
            index.push(v);
            if (all_matchings == '') {
                all_matchings += 'Рёбра в максимальном паросочетании:<br>';
            }
            change_edge_color(mt[v], v, '#000000');
            all_matchings += '(' + mt[v].toString() + ', ' + v.toString() + ')<br>';
        }
    }
    if (all_matchings == '') {
        all_matchings += 'Максимальное паросочетание пусто<br>';
    }
    push_state_multi(all_matchings, index);
}

function show(index) {
    refresh_graph();
    s = new sigma({
        graph : states.data[index],
        container : 'container',
        settings: {
            defaultNodeColor: '#C6E746'
        }
    });
    document.getElementById('code').innerHTML = states.message[index];
    s.refresh();
    createTable(states.color[index][0], states.color[index][1]);
}

function nextStep() {
    if (ind != states.data.length) {
        show(ind);
        ++ind;
    }
}

function prevStep() {
    if (ind != 0) {
        --ind;
        show(ind);
    }
}