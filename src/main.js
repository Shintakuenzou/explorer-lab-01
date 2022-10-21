import "./css/index.css";

import IMAsk from 'imask';


const bgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const bgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path ');

const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');


function setCardType(type) {
    const color = {
        visa: ['#436D99', '#2D57F2'],
        masterCard: ['#DF6F29', '#C69347'],
        default: ['black', 'gray']
    }
    bgColor01.setAttribute('fill', color[type][0]);
    bgColor02.setAttribute('fill', color[type][1]);
    ccLogo.setAttribute('src', `cc-${type}.svg`);
}



const CVC = document.querySelector('#security-code');
const CvcCodigoPattern = {
    mask: '0000',
}
const SecurityCodeMasked = IMAsk(CVC, CvcCodigoPattern);

const DataDeExpiracao = document.querySelector("#expiration-date");
const DataDeExpiracaoPattern = {
    mask: 'MM{/}YY',
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 5).slice(2)
        },
        MM: {
            mask: IMAsk.MaskedRange,
            from: 1,
            to: 12,
        },

    }
}
const DataDeExpiracaMasked = IMAsk(DataDeExpiracao, DataDeExpiracaoPattern)

const NumeroCartao = document.querySelector('#card-number');
const NumeroCartaoPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardType: 'visa',
        },

        {
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'masterCard',
        },

        {
            mask: '0000 0000 0000 0000',
            cardType: 'default',
        }
    ],

    dispatch: function (appended, dynamicMasked) {
        var number = (dynamicMasked.value + appended).replace(/\D/g, '');

        const foundMasked = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        });

        // console.log(foundMasked)
        return foundMasked
    }
}

const CardNumberMasked = IMask(NumeroCartao, NumeroCartaoPattern);

const AddBtn = document.querySelector('#btn');
AddBtn.addEventListener('click', () => {
    console.log('Clicou no Botão')
})


document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
})

const CardHolder = document.querySelector('#card-holder');
CardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value');
    console.log(CardHolder.value)
    // CardHolder.value === '' ? ccHolder.innerHTML = 'Fulano da silva' : ccHolder.innerHTML = CardHolder.value
    ccHolder.innerHTML = CardHolder.value.length === 0 ? 'Fulano da silva' : CardHolder.value
})


SecurityCodeMasked.on('accept', () => {
    updateSecurityCode(SecurityCodeMasked.value)
});

function updateSecurityCode(code) {
    const CcSecurity = document.querySelector('.cc-security .value');
    CcSecurity.innerHTML = code.length === 0 ? '123' : code
}

CardNumberMasked.on('accept', () => {
    const Type = CardNumberMasked.masked.currentMask.cardType
    setCardType(Type)
    updateNumber(CardNumberMasked.value)
})

function updateNumber (number) {
    const CcNumber = document.querySelector('.cc-number');
    CcNumber.innerHTML = number.length === 0 ? '1234 5678 9012 3456' : number
}

DataDeExpiracaMasked.on('accept', () => {
    updateDate(DataDeExpiracaMasked.value)
})

function updateDate(date) {
    const ccDate = document.querySelector('.cc-extra .value');
    ccDate.innerHTML = date.length === 0 ? '02/32' : date
}