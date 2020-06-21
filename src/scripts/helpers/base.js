const getFormElements = (formRef, inputNames) =>{

    const obj = {};

    Array.from(inputNames).forEach(c =>{

        obj[c] = formRef.querySelector(`input[name=${c}]`);
    });
};

export function isSomeDataEmpty(data) {

    return Object.entries(data)
        .some(kvp => kvp[1] === '');
}

export function getFormData(formRef, inputNames) {

    const formElements = getFormElements(formRef, inputNames);
    const obj = {};

    Array.from(inputNames).forEach(c =>{

        let element = formRef.querySelector(`input[name=${c}]`) ||
                        formRef.querySelector(`textarea[name=${c}]`);

        obj[c] = element.value;
    });

    return obj;
}

export function clearInputFields(formRef, inputNames) {

    Array.from(inputNames).forEach(c =>{

        let element = formRef.querySelector(`input[name=${c}]`) ||
            formRef.querySelector(`textarea[name=${c}]`);

        element.value = '';
    });
}

export function showMessage(message, state, timeout) {

    let bar;
    const notificationsDiv = document.querySelector('div#notifications');

    if (!notificationsDiv){
        return;
    }

    switch (state) {

        case 'success': bar = notificationsDiv.querySelector('div#successBox'); break;
        case 'error': bar = notificationsDiv.querySelector('div#errorBox'); break;
        case 'loading': bar = notificationsDiv.querySelector('div#loadingBox'); break;
    }

    if (!bar){
        return;
    }

    bar.textContent = message;
    bar.style.textAlign = 'center';
    bar.style.display = 'block';

    setTimeout(() =>{

        bar.style.display = 'none';
    } , timeout);
}