describe('Array', function() {
  it('should clear the array', function() {
    var array = [1, 2, 3, 4, 5];
    array.clear();
    expect(array.length).toEqual(0);
    expect(array[0]).toEqual(undefined);
    expect(array[4]).toEqual(undefined);
  });
});