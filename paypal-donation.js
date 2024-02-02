// paypal-donation.js

PayPal.Donation.Button({
    env: 'production',
    hosted_button_id: 'TM2PR4PEDX63N',
    image: {
        src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
        alt: 'Donate with PayPal button',
        title: 'PayPal - The safer, easier way to pay online!',
    }
}).render('#donate-button');
