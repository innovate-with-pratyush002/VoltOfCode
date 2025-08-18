/*  Utility: Create elements with attributes (simple, explicit) */
function createElementWith(tagName, attributes) {
    var el = document.createElement(tagName);
    var key;
    for (key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            el.setAttribute(key, attributes[key]);
        }
    }
    return el;
}

/* DOM References  */
var formEl = document.getElementById("resumeForm");

var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var summaryInput = document.getElementById("summary");
var skillsInput = document.getElementById("skills");

var educationList = document.getElementById("educationList");
var experienceList = document.getElementById("experienceList");

var addEducationBtn = document.getElementById("addEducationBtn");
var addExperienceBtn = document.getElementById("addExperienceBtn");

var clearFormBtn = document.getElementById("clearFormBtn");
var resetPreviewBtn = document.getElementById("resetPreviewBtn");
var downloadBtn = document.getElementById("downloadBtn");

var previewName = document.getElementById("previewName");
var previewEmail = document.getElementById("previewEmail");
var previewPhone = document.getElementById("previewPhone");
var previewSummary = document.getElementById("previewSummary");
var previewSkills = document.getElementById("previewSkills");
var previewEducation = document.getElementById("previewEducation");
var previewExperience = document.getElementById("previewExperience");

var progressFill = document.getElementById("progressFill");
var progressLabel = document.getElementById("progressLabel");

/*  Initialize with one blank Education & Experience item  */
addEducationItem();
addExperienceItem();

/*Live Update for Basic Fields */
formEl.addEventListener("input", function () {
    updatePreview();
    updateProgress();
});

/*Button Actions  */
addEducationBtn.addEventListener("click", function () {
    addEducationItem();
    updateProgress();
});

addExperienceBtn.addEventListener("click", function () {
    addExperienceItem();
    updateProgress();
});

clearFormBtn.addEventListener("click", function () {
    formEl.reset();
    educationList.innerHTML = "";
    experienceList.innerHTML = "";
    addEducationItem();
    addExperienceItem();
    updatePreviewDefaults();
    updateProgress();
});

resetPreviewBtn.addEventListener("click", function () {
    updatePreviewDefaults();
});

downloadBtn.addEventListener("click", function () {
    /*  user can save as PDF */
    window.print();
});

/* Create Education Item  */
function addEducationItem() {
    var wrapper = createElementWith("div", { "class": "repeat-item" });

    var grid = createElementWith("div", { "class": "repeat-grid" });

    var degree = createLabeledInput("Degree / Program:", "text", "degree");
    var institute = createLabeledInput("Institution:", "text", "institution");
    var year = createLabeledInput("Year or Duration:", "text", "year");
    var detail = createLabeledTextarea("Details (optional):", "detail");

    grid.appendChild(degree.container);
    grid.appendChild(institute.container);
    grid.appendChild(year.container);
    grid.appendChild(detail.container);

    var actions = createElementWith("div", { "class": "repeat-actions" });
    var removeButton = createElementWith("button", { "type": "button", "class": "remove-btn" });
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
        wrapper.remove();
        updatePreview();
        updateProgress();
    });
    actions.appendChild(removeButton);

    wrapper.appendChild(grid);
    wrapper.appendChild(actions);
    educationList.appendChild(wrapper);
}

/*  Create Experience Item  */
function addExperienceItem() {
    var wrapper = createElementWith("div", { "class": "repeat-item" });

    var grid = createElementWith("div", { "class": "repeat-grid" });

    var job = createLabeledInput("Job Title:", "text", "job");
    var company = createLabeledInput("Company:", "text", "company");
    var years = createLabeledInput("Year or Duration:", "text", "years");
    var desc = createLabeledTextarea("Description (optional):", "desc");

    grid.appendChild(job.container);
    grid.appendChild(company.container);
    grid.appendChild(years.container);
    grid.appendChild(desc.container);

    var actions = createElementWith("div", { "class": "repeat-actions" });
    var removeButton = createElementWith("button", { "type": "button", "class": "remove-btn" });
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
        wrapper.remove();
        updatePreview();
        updateProgress();
    });
    actions.appendChild(removeButton);

    wrapper.appendChild(grid);
    wrapper.appendChild(actions);
    experienceList.appendChild(wrapper);
}

/*  Labeled Inputs Helpers  */
function createLabeledInput(labelText, type, name) {
    var container = createElementWith("div", { "class": "field" });

    var label = createElementWith("label", {});
    label.textContent = labelText;

    var input = createElementWith("input", { "type": type, "data-name": name });
    input.addEventListener("input", function () {
        updatePreview();
        updateProgress();
    });

    container.appendChild(label);
    container.appendChild(input);

    return { container: container, input: input };
}

function createLabeledTextarea(labelText, name) {
    var container = createElementWith("div", { "class": "field" });

    var label = createElementWith("label", {});
    label.textContent = labelText;

    var textarea = createElementWith("textarea", { "data-name": name });
    textarea.setAttribute("rows", "3");
    textarea.addEventListener("input", function () {
        updatePreview();
        updateProgress();
    });

    container.appendChild(label);
    container.appendChild(textarea);

    return { container: container, textarea: textarea };
}

/*  Update Preview  */
function updatePreview() {
    var nameVal = nameInput.value;
    var emailVal = emailInput.value;
    var phoneVal = phoneInput.value;
    var summaryVal = summaryInput.value;
    var skillsVal = skillsInput.value;

    previewName.textContent = nameVal ? nameVal : "Your Name";
    previewEmail.textContent = emailVal ? emailVal : "your.email@example.com";
    previewPhone.textContent = phoneVal ? phoneVal : "+91 0000000000";
    previewSummary.textContent = summaryVal ? summaryVal : "Your summary will appear here...";

    /* Skills chips */
    previewSkills.innerHTML = "";
    if (skillsVal && skillsVal.trim().length > 0) {
        var parts = skillsVal.split(",");
        var i;
        for (i = 0; i < parts.length; i++) {
            var text = parts[i].trim();
            if (text.length > 0) {
                var chip = createElementWith("span", { "class": "skill-chip" });
                chip.textContent = text;
                previewSkills.appendChild(chip);
            }
        }
        if (previewSkills.children.length === 0) {
            var emptyChip = createElementWith("span", { "class": "skill-chip" });
            emptyChip.textContent = "Your skills will appear here...";
            previewSkills.appendChild(emptyChip);
        }
    } else {
        var chip2 = createElementWith("span", { "class": "skill-chip" });
        chip2.textContent = "Your skills will appear here...";
        previewSkills.appendChild(chip2);
    }

    /* Education preview */
    renderEduOrExp(educationList, previewEducation, true);

    /* Experience preview */
    renderEduOrExp(experienceList, previewExperience, false);
}

function updatePreviewDefaults() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    summaryInput.value = "";
    skillsInput.value = "";

    updatePreview();
}

/*  Render Education/Experience to Preview  */
function renderEduOrExp(sourceList, targetWrap, isEducation) {
    targetWrap.innerHTML = "";
    var items = sourceList.querySelectorAll(".repeat-item");
    if (items.length === 0) {
        var emptyDiv = createElementWith("div", { "class": "empty-note" });
        if (isEducation) {
            emptyDiv.textContent = "Your education details will appear here...";
        } else {
            emptyDiv.textContent = "Your experience details will appear here...";
        }
        targetWrap.appendChild(emptyDiv);
        return;
    }

    var i;
    for (i = 0; i < items.length; i++) {
        var fields = items[i].querySelectorAll("input, textarea");
        var data = {};
        var j;
        for (j = 0; j < fields.length; j++) {
            var key = fields[j].getAttribute("data-name");
            var val = fields[j].value;
            data[key] = val;
        }

        var block = createElementWith("div", { "class": "edu-exp-item" });

        var title = createElementWith("div", { "class": "edu-exp-title" });
        var sub = createElementWith("div", { "class": "edu-exp-sub" });
        var year = createElementWith("div", { "class": "edu-exp-year" });

        if (isEducation) {
            title.textContent = data.degree ? data.degree : "Degree / Program";
            sub.textContent = data.institution ? data.institution : "Institution";
            year.textContent = data.year ? data.year : "Year or Duration";
        } else {
            title.textContent = data.job ? data.job : "Job Title";
            sub.textContent = data.company ? data.company : "Company";
            year.textContent = data.years ? data.years : "Year or Duration";
        }

        block.appendChild(title);
        block.appendChild(sub);
        block.appendChild(year);

        if (isEducation) {
            if (data.detail && data.detail.trim().length > 0) {
                var para = createElementWith("div", { "class": "edu-exp-sub" });
                para.textContent = data.detail;
                block.appendChild(para);
            }
        } else {
            if (data.desc && data.desc.trim().length > 0) {
                var para2 = createElementWith("div", { "class": "edu-exp-sub" });
                para2.textContent = data.desc;
                block.appendChild(para2);
            }
        }

        targetWrap.appendChild(block);
    }
}

/* Progress Calculation
   Counts how many inputs/textarea have non-empty values.
   Includes dynamic education and experience fields. */
function updateProgress() {
    var allFields = [];
    var staticFields = [nameInput, emailInput, phoneInput, summaryInput, skillsInput];
    var i;

    for (i = 0; i < staticFields.length; i++) {
        allFields.push(staticFields[i]);
    }

    var dynamicInputs = document.querySelectorAll("#educationList input, #educationList textarea, #experienceList input, #experienceList textarea");
    var j;
    for (j = 0; j < dynamicInputs.length; j++) {
        allFields.push(dynamicInputs[j]);
    }

    var filled = 0;
    var total = allFields.length;

    var k;
    for (k = 0; k < allFields.length; k++) {
        var val = allFields[k].value;
        if (val && val.trim().length > 0) {
            filled = filled + 1;
        }
    }

    var percent = 0;
    if (total > 0) {
        percent = Math.round((filled / total) * 100);
    }

    progressFill.style.width = percent + "%";
    progressLabel.textContent = "Form Completion: " + percent + "%";
}

/*  Initial Render  */
updatePreview();
updateProgress();
