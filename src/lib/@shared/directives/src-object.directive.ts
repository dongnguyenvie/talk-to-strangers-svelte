export function srcObject(node: HTMLVideoElement, stream: MediaStream) {
	node.srcObject = stream;
	return {
		update(newStream: MediaStream) {
			if (node.srcObject != newStream) {
				// the important change
				node.srcObject = newStream;
			}
		}
	};
}
