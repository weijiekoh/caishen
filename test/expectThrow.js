module.exports = async promise => {
  try {
    await promise;
    return false;
  } 
  catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;

    assert(invalidOpcode || outOfGas || revert,
           'Expected throw, got \'' + error + '\' instead');
    return true;
  }
  assert.fail('Expected throw not received');
};
