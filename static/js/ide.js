let editor;

window.onload = () => {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night");
    editor.setOptions({
        fontSize: "12pt"
      });
    editor.session.setMode("ace/mode/python")
}

const upsizeMain = () => {
    if ($('#resize-me').hasClass('resize-me')){
        $('#resize-me').removeClass("resize-me");
    }
    else {$('#resize-me').addClass("resize-me");}
    if ($('.scroll-up-btn').hasClass('move-over')){
        $('.scroll-up-btn').removeClass("move-over");
    }
    else {$('.scroll-up-btn').addClass("move-over");}
}
const downsizeMain = () => {
    $('#resize-me').removeClass("resize-me");
    $('.scroll-up-btn').removeClass("move-over");
}
const nextPage = () => {
    $('#close-editor').click();
}
const executeCode = () => {
    getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    csrfSafeMethod = (method) => {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    setRequestHeader = () => {
        $.ajaxSetup({
            beforeSend: (xhr, settings) => {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    }
    
    let csrftoken = getCookie('csrftoken');

    setRequestHeader();

    $.ajax({
        url: "compile/",
        method: "POST",
        data: {
            language: "python",
            code: editor.getSession().getValue()
        },

        success: (res) => {
            $(".output").empty()
            let eachLine = res.split('\n');
            let output = ''
            for (let line of eachLine){
                line = line.replace(/</,'&lt;');
                output+=`<div>${line}</div>`
            }
            $(".output").append(output)
            console.log(output)
        },

        error: () => {
            alert('error');
        },
    })
}