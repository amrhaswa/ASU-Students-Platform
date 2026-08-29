document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.getElementById('btn-submit');
    const btnClear = document.getElementById('btn-clear');
    const reportTextarea = document.getElementById('report-textarea');

    btnSubmit.addEventListener('click', () => {
        let hasError = false;

        const bookName = document.getElementById('book-name').value.trim();
        const errBookName = document.getElementById('err-book-name');
        if (!bookName) {
            errBookName.style.display = 'block';
            hasError = true;
        } else {
            errBookName.style.display = 'none';
        }

        const bookPrice = parseFloat(document.getElementById('book-price').value);
        const errBookPrice = document.getElementById('err-book-price');
        if (isNaN(bookPrice) || bookPrice <= 0) {
            errBookPrice.style.display = 'block';
            hasError = true;
        } else {
            errBookPrice.style.display = 'none';
        }

        const bookCondition = document.getElementById('book-condition').value;
        const errBookCondition = document.getElementById('err-book-condition');
        if (!bookCondition) {
            errBookCondition.style.display = 'block';
            hasError = true;
        } else {
            errBookCondition.style.display = 'none';
        }

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
            hasError = true;
        } else {
            errDelivery.style.display = 'none';
        }

        const termsChecked = document.getElementById('terms').checked;
        const errTerms = document.getElementById('err-terms');
        if (!termsChecked) {
            errTerms.style.display = 'block';
            hasError = true;
        } else {
            errTerms.style.display = 'none';
        }

        if (hasError) {
            reportTextarea.value = "فشل التحقق: يرجى إكمال الحقول المطلوبة بالشكل الصحيح.";
            return;
        }

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
