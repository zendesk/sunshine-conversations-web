const sinon = require('sinon');

function returnsSyncThunk({value} = {}) {
    return this.returns(() => value);
}

function returnsAsyncThunk({value, rejects = false} = {}) {
    return this.returns(() => rejects ? Promise.reject(value) : Promise.resolve(value));
}

sinon.stub.returnsSyncThunk = returnsSyncThunk;
sinon.behavior.returnsSyncThunk = returnsSyncThunk;
sinon.stub.returnsAsyncThunk = returnsAsyncThunk;
sinon.behavior.returnsAsyncThunk = returnsAsyncThunk;
