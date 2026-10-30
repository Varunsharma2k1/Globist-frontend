// Reference packages (frontend-only — not in the backend) for the places on
// the Home carousel, each offered by several agencies so the carousel can
// open Explore on that place and show the choice. Raw API shape, tagged
// with `places` so Explore treats the place as a destination.
import kalpa from './kalpa';
import kedarkantha from './kedarkantha';
import munsiyari from './munsiyari';
import valleyOfFlowers from './valleyOfFlowers';

export default [...kalpa, ...kedarkantha, ...munsiyari, ...valleyOfFlowers];
