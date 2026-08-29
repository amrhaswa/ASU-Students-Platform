document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.getElementById('btn-submit');
    const btnClear = document.getElementById('btn-clear');
    const reportTextarea = document.getElementById('report-textarea');

    function validateBookName() {
        const bookName = document.getElementById('book-name').value.trim();
        const errBookName = document.getElementById('err-book-name');
        if (!bookName) {
            errBookName.style.display = 'block';
            return { valid: false, value: null };
        } else {
            errBookName.style.display = 'none';
            return { valid: true, value: bookName };
        }
    }

    function validatePrice() {
        const bookPrice = parseFloat(document.getElementById('book-price').value);
        const errBookPrice = document.getElementById('err-book-price');
        if (isNaN(bookPrice) || bookPrice <= 0) {
            errBookPrice.style.display = 'block';
            return { valid: false, value: null };
        } else {
            errBookPrice.style.display = 'none';
            return { valid: true, value: bookPrice };
        }
    }

    function validateCondition() {
        const bookCondition = document.getElementById('book-condition').value;
        const errBookCondition = document.getElementById('err-book-condition');
        if (!bookCondition) {
            errBookCondition.style.display = 'block';
            return { valid: false, value: null };
        } else {
            errBookCondition.style.display = 'none';
            return { valid: true, value: bookCondition };
        }
    }

    function validateDelivery() {
        const deliveryRadios = document.getElementsByName('delivery');
        let deliveryMethod = '';
        for (const radio of deliveryRadios) {
            if (radio.checked) {
                deliveryMethod = radio.value;
                break;
            }
        }
        const errDelivery = document.getElementById('err-delivery');
        if (!deliveryMethod) {
            errDelivery.style.display = 'block';
            return { valid: false, value: null };
        } else {
            errDelivery.style.display = 'none';
            return { valid: true, value: deliveryMethod };
        }
    }

    function validateTerms() {
        const termsChecked = document.getElementById('terms').checked;
        const errTerms = document.getElementById('err-terms');
        if (!termsChecked) {
            errTerms.style.display = 'block';
            return { valid: false, value: null };
        } else {
            errTerms.style.display = 'none';
            return { valid: true, value: termsChecked };
        }
    }

    btnSubmit.addEventListener('click', () => {
        const nameResult = validateBookName();
        const priceResult = validatePrice();
        const conditionResult = validateCondition();
        const deliveryResult = validateDelivery();
        const termsResult = validateTerms();

        if (!nameResult.valid || !priceResult.valid || !conditionResult.valid || !deliveryResult.valid || !termsResult.valid) {
            reportTextarea.value = "فشل التحقق: يرجى إكمال الحقول المطلوبة بالشكل الصحيح.";
            return;
        }

        const bookName = nameResult.value;
        const bookPrice = priceResult.value;
        const bookCondition = conditionResult.value;
        const deliveryMethod = deliveryResult.value;

        let totalCost = bookPrice;
        let deliveryText = "تسليم باليد داخل الجامعة (مجانًا)";
        if (deliveryMethod === 'shipping') {
            totalCost += 2;
            deliveryText = "توصيل مأجور (+2 دينار)";
        }
        
        let platformFee = bookPrice * 0.05;
        let netProfit = bookPrice - platformFee;

        let report = `=== ملخص العملية (Order Summary) ===\n`;
        report += `اسم الكتاب: ${bookName}\n`;
        report += `حالة الكتاب: ${bookCondition}\n`;
        report += `السعر المطلوب: ${bookPrice} د.أ\n`;
        report += `طريقة التوصيل: ${deliveryText}\n`;
        report += `الموافقة على شروط النشر: نعم\n`;
        report += `-----------------------------\n`;
        report += `التكلفة الإجمالية على المشتري: ${totalCost} د.أ\n`;
        report += `عمولة المنصة (5%): ${platformFee.toFixed(2)} د.أ\n`;
        report += `صافي الربح المتوقع: ${netProfit.toFixed(2)} د.أ\n`;
        report += `\n(الطلب مستوفٍ للشروط وجاهز للنشر)`;

        reportTextarea.value = report;
    });

    btnClear.addEventListener('click', () => {
        document.getElementById('book-sale-form').reset();
        document.getElementById('err-book-name').style.display = 'none';
        document.getElementById('err-book-price').style.display = 'none';
        document.getElementById('err-book-condition').style.display = 'none';
        document.getElementById('err-delivery').style.display = 'none';
        document.getElementById('err-terms').style.display = 'none';
        reportTextarea.value = '';
    });
});