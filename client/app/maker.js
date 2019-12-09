const handleTens = (e) => {
    e.preventDefault();

    $("#tensMessage").animate({width:'hide'}, 350);
    if($("#tensName").val() == '') {
        handleError("All fields required");
        return false;
    }

    sendAjax('POST', $("#tensForm").attr("action"), $("#tensForm").serialize(), function() {
        loadTensFromServer();
    });

    return false;
};

const TensForm = (props) => {
    return (
        <form id="tensForm" name="tensForm" onSubmit={handleTens} action="/maker" method="POST" className="tensForm">
            <label htmlFor="name">Names (separate by commas): </label>
            <input id="tensName" type="text" name="name" placeholder="Tens Names" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeTensSubmit" type="submit" value="Make Tens" />
        </form>
    );
};

const TensList = function(props) {
    if(props.tens.length === 0)
    {
        return(
            <div className="tensList">
                <h3 className="emptyTens">No Tens yet</h3>
            </div>
        );
    }

    const tensNodes = props.tens.map(function(tens) {
        let ten = tens.name[0].split(',');
        let ten1 = [];
        let ten2 = [];
        let numOn1 = 0;
        let numOn2 = 0;
        for(name of ten)
        {
            let random = Math.random();
            if(random < 0.5 && numOn1 < 5)
            {
                ten1[numOn1] = name;
                numOn1 += 1;
            }
            else if(random >= 0.5 && numOn2 < 5) {
                ten2[numOn2] = name;
                numOn2 += 1;
            }
            else if(random < 0.5 && numOn1 > 4)
            {
                ten2[numOn2] = name;
                numOn2 += 1;
            }
            else if(random >= 0.5 && numOn2 > 4) {
                ten1[numOn1] = name;
                numOn1 += 1;
            }
        }
        return (
            <div key={tens._id} className="tens">
                <h3 className="tensName"> Team 1: {ten1}</h3>
                <h3 className="tensName"> Team 2: {ten2}</h3>
            </div>
        );
    });

    return(
        <div className="tensList">
            {tensNodes}
        </div>
    );
};

const loadTensFromServer = () => {
    sendAjax('GET', '/getTens', null, (data) =>{
        ReactDOM.render(
            <TensList tens={data.tens} />,
            document.querySelector("#tens")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <TensForm csrf={csrf} />,
        document.querySelector("#makeTens")
    );

    ReactDOM.render(
        <TensList tens={[]} />,
        document.querySelector("#tens")
    );

    loadTensFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function() {
    getToken();
});