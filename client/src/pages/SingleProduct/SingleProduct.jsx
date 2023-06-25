import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Rating, Typography } from "@mui/material";
import { getDetailsList } from "./utils";
import styles from "./SingleProduct.module.scss";
import { fetchProducts } from "../../store/actionCreator/products.actionCreator";
import { selectProducts } from "../../store/selectors/products.selector";
import BreadcrumbsApp from "../../components/BreadcrumbsApp/BreadcrumbsApp";
import handleAddToCart, {
  handleAddToWishList,
} from "../../utils/cart/handleAddToCart";
import { selectCustomers } from "../../store/selectors/customers.selector";
import AboutProductSlider from "../../components/Sliders/AboutProductSlider/AboutProductSlider";
import Support from "../../components/Support/Support";
import Features from "../../components/Features/Features";
import { selectWishList } from "../../store/selectors/wishList.selector";
import { fetchCommentsByProduct } from "../../store/actionCreator/comments.actionCreator";
import { IconWishList, IconEmail } from "../../assets/images/products";
import LoginSnackbar from "../../components/LoginForm/LoginSnackbar";
import IconComparisonProduct from "../../components/IconComparisonProduct/IconComparisonProduct";
import Reviews from "../../components/Reviews/Reviews";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector(selectProducts);
  const { isLogin } = useSelector(selectCustomers);
  const { itemsWishList } = useSelector(selectWishList);
  const isWishList = itemsWishList?.some((item) => item.id === id);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [detailsList, setDetailsList] = useState(null);
  const [isActiveTab, setIsActiveTab] = useState({
    status: true,
    title: "About Product",
  });
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    dispatch(fetchProducts(""));
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      const currentProduct = products.find((product) => product._id === id);
      const list = getDetailsList(currentProduct.characteristics);
      setCurrentProduct(currentProduct);
      setDetailsList(list);
    }
  }, [id, products]);

  useEffect(() => {
    dispatch(fetchCommentsByProduct(id))
      .unwrap()
      .then((comments) => {
        setCommentsCount(parseInt(comments.length, 10));
      });
  });

  if (!currentProduct) {
    return (
      <Box sx={{ margin: "40px" }} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const {
    name,
    categories,
    currentPrice,
    description,
    itemNo,
    alt,
    available,
    rating,
    oldPrice,
  } = currentProduct;

  const breadcrumbsCustomData = [
    { label: "Home", url: "/" },
    {
      label: categories,
      url: `/${categories}?categories=${categories}&perPage=8&startPage=1&sort=-rating`,
    },
    { label: name },
  ];

  const tabToggle = (event) => {
    const title = event.target.innerText;
    setIsActiveTab({
      status: true,
      title,
    });
  };

  const activeTabContent = (() => {
    if (isActiveTab.title === "About Product") {
      return (
        <p className={styles["product-info__description"]}>
          {description[0].title}
        </p>
      );
    }
    if (isActiveTab.title === "Details") {
      return <ul className={styles["details-list"]}>{detailsList}</ul>;
    }
    if (isActiveTab.title === "Reviews") {
      return <Reviews productId={id} />;
    }
    return null;
  })();

  return (
    <>
      <div className={styles.product}>
        <div className={styles.header}>
          <div className={styles.inner}>
            <ul className={styles.tabs}>
              <li
                className={cn(styles.tabs__item, {
                  [styles["tabs__item--active"]]:
                    isActiveTab.status && isActiveTab.title === "About Product",
                })}
                onClick={(event) => tabToggle(event)}
              >
                About Product
              </li>
              <li
                className={cn(styles.tabs__item, {
                  [styles["tabs__item--active"]]:
                    isActiveTab.status && isActiveTab.title === "Details",
                })}
                onClick={(event) => tabToggle(event)}
              >
                Details
              </li>
              <li
                className={cn(styles.tabs__item, {
                  [styles["tabs__item--active"]]:
                    isActiveTab.status && isActiveTab.title === "Reviews",
                })}
                onClick={(event) => tabToggle(event)}
              >
                Reviews
              </li>
            </ul>
            <div className={styles.control}>
              <div className={styles.count}>
                <p className={styles.count__text}>
                  On Sale from{" "}
                  <span className={styles["count__text--bold"]}>
                    {`${currentPrice}.00 ₴`}
                  </span>
                </p>
              </div>
              <Link to={"/shopping-cart"}>
                <Button
                  variant="contained"
                  size="large"
                  className={styles.button}
                  onClick={() => {
                    dispatch(
                      handleAddToCart(
                        {
                          id,
                          image: description[0].image,
                          alt,
                          description: name,
                          currentPrice,
                          itemNo,
                          categories,
                        },
                        isLogin,
                      ),
                    );
                  }}
                >
                  Add to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.col}>
            <div className={styles["product-info"]}>
              <div className={styles["product-info__inner"]}>
                <div className={styles["product-info__breadcrumbs"]}>
                  <BreadcrumbsApp
                    breadcrumbsCustomData={breadcrumbsCustomData}
                  />
                </div>
                <h1 className={styles["product-info__title"]}>
                  {currentProduct.name}
                </h1>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating
                    className={styles.rating}
                    name="products-small"
                    value={parseFloat(rating)}
                    readOnly
                    size="small"
                  />
                  <Typography className={styles.reviews} variant="body2" ml={1}>
                    Reviews ({commentsCount})
                  </Typography>
                </Box>
                {activeTabContent}
                <div className={styles["product-info__footer"]}>
                  <p className={styles["product-info__support"]}>
                    Have a Question?{" "}
                    <Link
                      to="/contact"
                      className={styles["product-info__support-link"]}
                    >
                      Contact Us
                    </Link>
                  </p>
                  <p className={styles["product-info__code"]}>{itemNo}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles["product-picture"]}>
              <div className={styles["product-picture__inner"]}>
                <ul className={styles["product-picture__control"]}>
                  <li className={styles["product-picture__control-item"]}>
                    <Button>
                      <IconEmail />
                    </Button>
                  </li>
                  <li className={styles["product-picture__control-item"]}>
                    <IconComparisonProduct
                      id={id}
                      setStatus={setStatus}
                      setError={setError}
                      setText={setText}
                      categories={categories}
                      setOpenSnackbar={setOpenSnackbar}
                    />
                  </li>
                  <li className={styles["product-picture__control-item"]}>
                    <Button
                      onClick={() => {
                        dispatch(
                          handleAddToWishList(
                            {
                              id,
                              image: description[0].image,
                              alt,
                              description: name,
                              currentPrice,
                              itemNo,
                              categories,
                              available,
                              rating,
                              oldPrice,
                            },
                            itemsWishList,
                            isLogin,
                          ),
                        );
                      }}
                    >
                      <IconWishList
                        className={isWishList ? cn(styles.green) : ""}
                      />
                    </Button>
                  </li>
                </ul>
                <img
                  src={description[0].image}
                  alt={name}
                  className={styles["product-picture__image"]}
                />
              </div>
            </div>
          </div>
        </div>
        <LoginSnackbar
          open={openSnackbar}
          status={status}
          handleClose={handleClose}
          textSuccess={text}
          textError={error}
        />
      </div>
      <AboutProductSlider data={description} />
      <Support />
      <Features />
    </>
  );
};

export default SingleProduct;
