import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1 },
    formHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    scrollViewContent: { padding: 16, flexGrow: 1 },
    label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
    picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 },
    optionContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    optionButton: { borderWidth: 1, borderColor: '#007BFF', borderRadius: 8, padding: 10, marginRight: 10, marginBottom: 10 },
    selectedOption: { backgroundColor: '#007BFF' },
    optionText: { fontSize: 16, color: '#007BFF' },
    selectedText: { color: '#fff' },
    imagePicker: { backgroundColor: '#007BFF', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 20 },
    imagePickerText: { color: '#fff', fontSize: 16 },
    imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 80 },
    image: { width: 100, height: 100, marginRight: 10, marginBottom: 10 },
    // stickyButton: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ccc', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    removeButton: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    uploadArea: {
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 10, // Reduced padding for height
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        width: '100%', // Use full width
        height: 80, // Set a fixed height
        alignSelf: 'center', // Center the element horizontally
    },
    uploadText: {
        marginTop: 5,
        fontSize: 14,
        color: '#007BFF',
        textAlign: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});
