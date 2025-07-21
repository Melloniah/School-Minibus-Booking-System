import { routes } from '../../lib/routes';
import InteractiveMapWrapper from "../../components/InteractiveMap";

export default function RouteMapPage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return <InteractiveMapWrapper apiKey={apiKey} routes={routes} />;
}