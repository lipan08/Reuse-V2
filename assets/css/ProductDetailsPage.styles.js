import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    imageGallery: {
        height: width * 0.8,
    },
    galleryImage: {
        width: width,
        height: width * 0.8,
        resizeMode: 'cover',
    },
    detailsSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    mapContainer: {
        height: 180,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginVertical: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
    },
    chatButton: {
        backgroundColor: '#007bff',
    },
    callButton: {
        backgroundColor: '#27ae60',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    addressContainer: {
        marginVertical: 8,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    addressTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
        color: '#1a1a1a',
    },
    addressText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    viewMapText: {
        color: '#007bff',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 6,
    },
    // For loading states
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    // Product-specific details
    priceText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2ecc71',
        marginVertical: 8,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginVertical: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginVertical: 8,
    },
    specContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    specLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    specValue: {
        fontSize: 14,
        color: '#1a1a1a',
        flex: 1,
        textAlign: 'right',
    },
    sectionContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    sellerCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    sellerInfo: {
        flex: 1,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    postedText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    followButton: {
        padding: 8,
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        width: '100%', // Ensure the container takes full width
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        flexWrap: 'nowrap', // Prevent wrapping
    },
    mapIcon: {
        marginLeft: 8, // Adjust spacing for better alignment
    },
    addressHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 5,
    },
    addressText: {
        fontSize: 15,
        color: '#444',
        marginRight: 8,
        flexShrink: 1, // Shrinks the text if space is limited
    },
    mapAddressOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        maxWidth: '80%',
        zIndex: 10,
    },
    mapAddressText: {
        color: '#222',
        fontSize: 13,
        fontWeight: '500',
    },
});

export default styles;