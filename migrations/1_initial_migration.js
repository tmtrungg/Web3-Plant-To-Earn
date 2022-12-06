const Plant = artifacts.require("Gamble");

module.exports = function (deployer) {
  deployer.deploy(Plant,10);
};
