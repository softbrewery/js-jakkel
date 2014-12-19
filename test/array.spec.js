describe('Array clear', function() {
  it('should clear the array', function() {
    var array = [1, 2, 3, 4, 5];
    array.clear();
    expect(array.length).toEqual(0);
    expect(array[0]).toEqual(undefined);
    expect(array[4]).toEqual(undefined);
  });
});

describe("Array contains", function() {
  it('should be able to find something in the array', function() {
    var word_array = ["zero", "one", "two"];
    expect(word_array.contains( "two" )).toEqual(true);
    expect(word_array.contains( "foo" )).toEqual(false);
  });
});
