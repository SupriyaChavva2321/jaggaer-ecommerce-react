import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  IconButton,
  Stack,
  Container,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT, GET_CART_COUNT, GET_CART } from "../graphql/queries";
import { ADD_TO_CART } from "../graphql/mutations";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Product } from "../models/Product";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imageState, setImageState] = useState({ main: "", modal: "" });
  const [openModal, setOpenModal] = useState(false);

  const { data, loading, error } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
    onCompleted: (data) => {
      if (data?.product) {
        setImageState((prev) => ({ ...prev, main: data.product.imageUrl }));
      }
    },
  });

  const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }, { query: GET_CART_COUNT }],
  });

  const handleAddToCart = async () => {
    try {
      if (data?.product) {
        await addToCart({
          variables: { productId: data.product.id, quantity },
        });
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const handleModalOpen = (url: string) => {
    setImageState((prev) => ({ ...prev, modal: url }));
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setImageState((prev) => ({ ...prev, modal: "" }));
  };

  const handleGoBack = () => navigate("/products");

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography align="center">Loading product details...</Typography>
      </Container>
    );
  }

  if (error || !data?.product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography align="center">
          Error loading product or product not found.
        </Typography>
      </Container>
    );
  }

  const {
    name,
    imageUrl,
    thumbnailUrls,
    shortDescription,
    longDescription,
    rating,
    price,
  } = data.product;
  const { main, modal } = imageState;
  const thumbnails = thumbnailUrls?.length
    ? thumbnailUrls
    : [imageUrl, imageUrl, imageUrl];

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 1 }}>
      <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleGoBack} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <CustomBreadcrumbs
          items={[{ label: "Products", path: "/products" }, { label: name }]}
        />
      </Box>

      <Paper elevation={0} sx={{ p: 1, borderRadius: 1, bgcolor: "white" }}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={4}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            flexShrink={0}
            width={{ xs: "100%", sm: 450, md: 500 }}
            gap={2}
          >
            <Stack direction="column" spacing={1} sx={{ width: 80 }}>
              {thumbnails.map((thumbUrl, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setImageState((prev) => ({ ...prev, main: thumbUrl }))
                  }
                >
                  <Box
                    component="img"
                    src={thumbUrl}
                    alt={`${name} thumbnail ${idx + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      border:
                        main === thumbUrl
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                      borderRadius: 1,
                      p: 1,
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      p: 0.5,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalOpen(thumbUrl);
                    }}
                  >
                    <SearchIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                height: 400,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={main}
                alt={name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                }}
                onClick={() => handleModalOpen(main)}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1, pl: { sm: 2, md: 0 } }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {shortDescription}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({rating} average)
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
              € {price.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              all prices incl. 10% taxes
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  px: 1,
                }}
              >
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(val);
                    }
                  }}
                  style={{
                    width: "100px",
                    height: "40px",
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    fontSize: "1rem",
                    background: "transparent",
                  }}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={
                  <Box
                    component="img"
                    src="https://img.icons8.com/material-outlined/24/ffffff/shopping-cart--v1.png"
                    alt="cart"
                    sx={{ width: 16, height: 16 }}
                  />
                }
                onClick={handleAddToCart}
                disabled={adding}
                sx={{
                  minWidth: 150,
                  py: 1,
                  textTransform: "uppercase",
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                {adding ? "ADDING..." : "ADD TO CART"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: "#f5f5f5"
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          Description
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
          {longDescription}
        </Typography>
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <DialogContent
          sx={{
            position: "relative",
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              bgcolor: "white",
              p: 2,
              borderRadius: 2,
              maxWidth: "90%",
              maxHeight: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "white",
                "&:hover": { bgcolor: "lightgray" },
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={modal}
              alt={name}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;
