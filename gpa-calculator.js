




document.addEventListener("DOMContentLoaded", function () {

    
    var coursesContainer = document.getElementById("courses-container");
    var addCourseBtn     = document.getElementById("add-course-btn");
    var calcBtn          = document.getElementById("calc-btn");
    var previewHours     = document.getElementById("preview-hours");
    var previewCount     = document.getElementById("preview-count");
    var previewGPA       = document.getElementById("preview-gpa");
    var prevGpaInput     = document.getElementById("prev-gpa");
    var prevHoursInput   = document.getElementById("prev-hours");
    var resultSemester   = document.getElementById("result-semester-gpa");
    var resultCumulative = document.getElementById("result-cumulative-gpa");
    var resultGrade      = document.getElementById("result-grade");

    
    function getCourseRows() {
        return coursesContainer ? coursesContainer.querySelectorAll(".course-row") : [];
    }

    function buildCourseRow() {
        var row = document.createElement("div");
        row.className = "course-row";
        row.innerHTML = '<div><select><option value="3">3</option><option value="1">1</option><option value="2">2</option><option value="4">4</option></select></div><div><input type="number" placeholder="مثال: 85" min="0" max="100"></div><button class="remove-btn" type="button" aria-label="حذف المادة">&times;</button>';

        row.querySelector(".remove-btn").addEventListener("click", function () {
            row.remove();
            updatePreview();
        });
        row.querySelectorAll("select, input").forEach(function (el) {
            el.addEventListener("input", function() {
                if (el.type === 'number' && parseFloat(el.value) > 100) {
                    el.value = 100;
                }
                updatePreview();
            });
        });
        return row;
    }

    function classifyGrade(gpa) {
        if (gpa >= 92) return { label: "ممتاز مع مرتبة شرف", color: "#065f46", bg: "#d1fae5" };
        if (gpa >= 84) return { label: "ممتاز",              color: "#065f46", bg: "#d1fae5" };
        if (gpa >= 76) return { label: "جيد جداً",           color: "#1e40af", bg: "#dbeafe" };
        if (gpa >= 68) return { label: "جيد",                color: "#92400e", bg: "#fef3c7" };
        return          { label: "مقبول",                    color: "#b45309", bg: "#fef9c3" };
    }

    function calcSemester() {
        var rows = getCourseRows();
        var weightedSum = 0, totalHours = 0, validCount = 0;
        rows.forEach(function (row) {
            var hours = parseInt(row.querySelector("select").value, 10);
            var grade = parseFloat(row.querySelector("input").value);
            totalHours += hours;
            if (!isNaN(grade) && grade >= 0 && grade <= 100) {
                weightedSum += hours * grade;
                validCount++;
            }
        });
        var gpa = (validCount > 0 && totalHours > 0) ? (weightedSum / totalHours) : null;
        return { gpa: gpa, totalHours: totalHours, count: rows.length, weightedSum: weightedSum };
    }

    function updatePreview() {
        var rows = getCourseRows();
        var totalHours = 0, weightedSum = 0, validCount = 0;
        rows.forEach(function (row) {
            var hours = parseInt(row.querySelector("select").value, 10);
            var grade = parseFloat(row.querySelector("input").value);
            totalHours += hours;
            if (!isNaN(grade) && grade >= 0 && grade <= 100) {
                weightedSum += hours * grade;
                validCount++;
            }
        });
        if (previewHours) previewHours.textContent = totalHours;
        if (previewCount) previewCount.textContent = rows.length;
        if (previewGPA) {
            previewGPA.textContent = (validCount > 0 && totalHours > 0)
                ? (weightedSum / totalHours).toFixed(1) + "%"
                : "—";
        }
    }

    if (prevGpaInput) {
        prevGpaInput.addEventListener("input", function() {
            if (parseFloat(prevGpaInput.value) > 100) {
                prevGpaInput.value = 100;
            }
        });
    }

    if (addCourseBtn) {
        addCourseBtn.addEventListener("click", function () {
            var newRow = buildCourseRow();
            coursesContainer.appendChild(newRow);
            updatePreview();
            newRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }

    
    getCourseRows().forEach(function (row) {
        row.querySelector(".remove-btn").addEventListener("click", function () {
            row.remove();
            updatePreview();
        });
        row.querySelectorAll("select, input").forEach(function (el) {
            el.addEventListener("input", function() {
                if (el.type === 'number' && parseFloat(el.value) > 100) {
                    el.value = 100;
                }
                updatePreview();
            });
        });
    });

    
    if (calcBtn) {
        calcBtn.addEventListener("click", function () {
            var rows = getCourseRows();
            var hasValid = false;
            rows.forEach(function (row) {
                var grade = parseFloat(row.querySelector("input").value);
                if (!isNaN(grade) && grade >= 0 && grade <= 100) hasValid = true;
            });

            if (!hasValid) {
                alert("الرجاء إدخال درجة واحدة على الأقل لحساب المعدل.");
                return;
            }

            var result = calcSemester();
            var semGpa = result.gpa;
            var totalHours = result.totalHours;
            var weightedSum = result.weightedSum;

            var prevGpa   = parseFloat(prevGpaInput   ? prevGpaInput.value   : "");
            var prevHours = parseFloat(prevHoursInput ? prevHoursInput.value : "");

            var cumGpa = semGpa;
            var showCumulative = false;

            if (!isNaN(prevGpa) && !isNaN(prevHours) && prevHours > 0) {
                cumGpa = ((prevGpa * prevHours) + weightedSum) / (prevHours + totalHours);
                showCumulative = true;
            }

            var gradeInfo = classifyGrade(semGpa || 0);

            
            if (resultSemester) {
                if (semGpa !== null) {
                    animateNumber(resultSemester, 0, semGpa, 700);
                } else {
                    resultSemester.textContent = "—";
                }
            }

            
            var cumRow = document.getElementById("cumulative-row");
            if (cumRow) {
                if (showCumulative && resultCumulative) {
                    cumRow.style.display = "";
                    resultCumulative.textContent = cumGpa.toFixed(2) + "%";
                } else {
                    cumRow.style.display = "none";
                }
            }

            
            if (resultGrade) {
                resultGrade.textContent  = gradeInfo.label;
                resultGrade.style.color  = gradeInfo.color;
                resultGrade.style.background = gradeInfo.bg;
            }

            
            var resultBox = document.querySelector(".result-box");
            if (resultBox) resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }

    function animateNumber(el, start, end, duration) {
        var startTime = performance.now();
        function step(currentTime) {
            var elapsed  = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = (start + (end - start) * eased).toFixed(2) + "%";
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    updatePreview();
});
