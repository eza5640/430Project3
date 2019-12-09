"use strict";

var handleTens = function handleTens(e) {
    e.preventDefault();

    $("#tensMessage").animate({ width: 'hide' }, 350);
    if ($("#tensName").val() == '') {
        handleError("All fields required");
        return false;
    }

    sendAjax('POST', $("#tensForm").attr("action"), $("#tensForm").serialize(), function () {
        loadTensFromServer();
    });

    return false;
};

var TensForm = function TensForm(props) {
    return React.createElement(
        "form",
        { id: "tensForm", name: "tensForm", onSubmit: handleTens, action: "/maker", method: "POST", className: "tensForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Names (separate by commas): "
        ),
        React.createElement("input", { id: "tensName", type: "text", name: "name", placeholder: "Tens Names" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeTensSubmit", type: "submit", value: "Make Tens" })
    );
};

var TensList = function TensList(props) {
    if (props.tens.length === 0) {
        return React.createElement(
            "div",
            { className: "tensList" },
            React.createElement(
                "h3",
                { className: "emptyTens" },
                "No Tens yet"
            )
        );
    }

    var tensNodes = props.tens.map(function (tens) {
        var ten = tens.name[0].split(',');
        var ten1 = [];
        var ten2 = [];
        var numOn1 = 0;
        var numOn2 = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ten[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                name = _step.value;

                var random = Math.random();
                if (random < 0.5 && numOn1 < 5) {
                    ten1[numOn1] = name;
                    numOn1 += 1;
                } else if (random >= 0.5 && numOn2 < 5) {
                    ten2[numOn2] = name;
                    numOn2 += 1;
                } else if (random < 0.5 && numOn1 > 4) {
                    ten2[numOn2] = name;
                    numOn2 += 1;
                } else if (random >= 0.5 && numOn2 > 4) {
                    ten1[numOn1] = name;
                    numOn1 += 1;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return React.createElement(
            "div",
            { key: tens._id, className: "tens" },
            React.createElement(
                "h3",
                { className: "tensName" },
                " Team 1: ",
                ten1
            ),
            React.createElement(
                "h3",
                { className: "tensName" },
                " Team 2: ",
                ten2
            )
        );
    });

    return React.createElement(
        "div",
        { className: "tensList" },
        tensNodes
    );
};

var loadTensFromServer = function loadTensFromServer() {
    sendAjax('GET', '/getTens', null, function (data) {
        ReactDOM.render(React.createElement(TensList, { tens: data.tens }), document.querySelector("#tens"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TensForm, { csrf: csrf }), document.querySelector("#makeTens"));

    ReactDOM.render(React.createElement(TensList, { tens: [] }), document.querySelector("#tens"));

    loadTensFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#tensMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#tensMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            //var messageObj = JSON.parse(xhr.responseText);
            //handleError(messageObj.error);
        }
    });
};
