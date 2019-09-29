import factory from "./";

describe("doseur", () => {
  describe("enqueue", () => {
    it("enqueues items and flushes after timeout", done => {
      const timeout = 100;

      const spy = jest.fn();
      const batcher = factory(spy, 10, timeout);

      batcher.enqueue(1);

      setTimeout(() => {
        batcher.enqueue(2, 3);
      }, timeout / 3);

      expect(spy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(1, 2, 3);
        done();
      }, timeout);
    });

    it("flushes right away if more than maxQueue added", done => {
      const timeout = 100;

      const spy = jest.fn();
      const batcher = factory(spy, 3, timeout);

      batcher.enqueue(1, 2, 3);
      expect(spy).toHaveBeenCalledWith(1, 2, 3);
      spy.mockClear();

      batcher.enqueue(4, 5);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(4, 5);
        done();
      }, timeout);
    });
  });

  describe("reset", () => {
    it("resets batcher discarding its state", done => {
      const timeout = 100;

      const spy = jest.fn();
      const batcher = factory(spy, 3, timeout);

      batcher.enqueue(1);

      expect(spy).not.toHaveBeenCalled();

      batcher.reset();
      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        done();
      }, timeout);
    });

    it("resets batcher without state", done => {
      const timeout = 100;

      const spy = jest.fn();
      const batcher = factory(spy, 3, timeout);

      expect(spy).not.toHaveBeenCalled();

      batcher.reset();
      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        done();
      }, timeout);
    });
  });
});
