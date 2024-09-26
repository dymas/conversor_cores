function openColorSystemInputs(color_system) {
  const colorForms = {
    color_input: document.getElementById("color-input"),
    color_input_label: document.getElementById("color-input-label"),
    converted_color_system_label: document.getElementById("converted-color-system-label"),
    converted_color_system: document.getElementById("converted-color-system"),
  }

  Object.values(inputs).forEach((input) => input.classList.add("hide"));
  Object.values(colorForms).forEach((input) => input.classList.add("hide"));

  if (inputs[color_system]) {
    Object.values(colorForms).forEach((input) => input.classList.remove("hide"));
    inputs[color_system].classList.remove("hide");
  }
}

function openColorSystemOutputs(color_system) {
  Object.values(outputs).forEach((output) => output.classList.add("hide"));

  if (outputs[color_system]) {
    outputs[color_system].classList.remove("hide");
  }
}

function updateColors(color) {
  document.querySelector("body").style.backgroundColor = color.rgb().string();
  document.getElementById("color-input").value = color.hex();

  const colorConversions = {
    rgb: color.rgb().color,
    cmyk: color.cmyk().color,
    hsl: color.hsl().color,
    hsv: color.hsv().color,
  };

  Object.keys(inputs).forEach((key) => {
    const fieldset = inputs[key];
    fieldset.querySelectorAll("input").forEach((input, index) => {
      input.value = Math.round(colorConversions[key][index]);
    });
  });

  Object.keys(outputs).forEach((key) => {
    const output = outputs[key];
    output.querySelectorAll("input").forEach((input, index) => {
      input.value = Math.round(colorConversions[key][index]);
    });
  });

}

const colorSystems = ["rgb", "cmyk", "hsl", "hsv"];
let originalColorSystem;
let chosenColorSystemToConvert;

const selectionOfColorSystems = {
  original: document.getElementById("original-color-system"),
  converted: document.getElementById("converted-color-system"),
};

const inputs = {
  rgb: document.getElementById("rgb-input"),
  cmyk: document.getElementById("cmyk-input"),
  hsl: document.getElementById("hsl-input"),
  hsv: document.getElementById("hsv-input"),
};

const outputs = {
  rgb: document.getElementById("rgb-output"),
  cmyk: document.getElementById("cmyk-output"),
  hsl: document.getElementById("hsl-output"),
  hsv: document.getElementById("hsv-output"),
};

const colorFunctions = {
  cmyk: Color.cmyk,
  hsl: Color.hsl,
  hsv: Color.hsv,
  rgb: Color.rgb,
};

selectionOfColorSystems.original.addEventListener("change", (event) => {
  const value = event.target.value;
  originalColorSystem = value;
  openColorSystemInputs(value);
});

selectionOfColorSystems.converted.addEventListener("change", (event) => {
  const value = event.target.value;
  chosenColorSystemToConvert = value;
  openColorSystemOutputs(value);
});

let color;

document.getElementById("color-input").addEventListener("input", (event) => {
  const value = event.target.value;
  color = Color(value);

  updateColors(color);
});

Object.values(inputs).forEach((fieldset) => {
  fieldset.addEventListener("input", (event) => {
    let current = [];

    fieldset.querySelectorAll("input").forEach((input) => {
      const value = input.value ? Number(input.value) : 0;

      current.push(value);
    });

    color = colorFunctions[originalColorSystem](current);

    updateColors(color);
  });
});