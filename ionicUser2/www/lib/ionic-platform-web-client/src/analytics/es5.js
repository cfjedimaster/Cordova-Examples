import { Analytics } from "./analytics";
import { BucketStorage } from "./storage";
import { DOMSerializer } from "./serializers";

// Declare the window object
window.Ionic = window.Ionic || {};

// Ionic Namespace
Ionic.Analytics = Analytics;

// Analytic Storage Namespace
Ionic.AnalyticStorage = {};
Ionic.AnalyticStorage.BucketStorage = BucketStorage;

// Analytic Serializers Namespace
Ionic.AnalyticSerializers = {};
Ionic.AnalyticSerializers.DOMSerializer = DOMSerializer;
