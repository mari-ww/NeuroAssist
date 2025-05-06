// variableManager.js

/**
 * @typedef {Object} Variable
 * @property {string} name  – nome da variável
 * @property {string} type  – tipo (e.g. "string", "number", "boolean", etc.)
 * @property {*}      value – valor atual
 */

/** @type {Variable[]} */
const variables = [];

/**
 * Cria e adiciona uma nova variável à lista.
 * @param {string} name
 * @param {string} type
 * @param {*}      value
 */
function addVariable(name, type, value) {
  if (!name || !type) {
    throw new Error("Nome e tipo são obrigatórios.");
  }

  const normalized = name.trim();
  const existing = variables.find(v => v.name === normalized);
  if (existing) {
    throw new Error(`Variável "${normalized}" já existe.`);
  }

  if (!isValueOfType(value, type)) {
    throw new Error(`Valor não corresponde ao tipo "${type}".`);
  }

  variables.push({ name: normalized, type, value });
}

/**
 * Atualiza o valor de uma variável existente.
 * @param {string} name
 * @param {*}      newValue
 */
function updateVariable(name, newValue) {
  const v = variables.find(v => v.name === name);
  if (!v) {
    throw new Error(`Variável "${name}" não encontrada.`);
  }

  if (!isValueOfType(newValue, v.type)) {
    throw new Error(`Novo valor não corresponde ao tipo "${v.type}".`);
  }

  v.value = newValue;
}

/**
 * Retorna a lista completa de variáveis.
 * @returns {Variable[]}
 */
function listVariables() {
  return [...variables]; // evita manipulação direta externa
}

/**
 * Remove uma variável da lista.
 * @param {string} name
 */
function removeVariable(name) {
  const index = variables.findIndex(v => v.name === name);
  if (index === -1) {
    throw new Error(`Variável "${name}" não encontrada.`);
  }
  variables.splice(index, 1);
}

/**
 * Verifica se o valor corresponde ao tipo especificado.
 * @param {*} value 
 * @param {string} type 
 * @returns {boolean}
 */
function isValueOfType(value, type) {
  switch (type) {
    case "string": return typeof value === "string";
    case "number": return typeof value === "number";
    case "boolean": return typeof value === "boolean";
    case "object": return typeof value === "object" && value !== null;
    case "array": return Array.isArray(value);
    case "any": return true;
    default: return false;
  }
}

module.exports = {
  addVariable,
  updateVariable,
  listVariables,
  removeVariable // opcional
};
