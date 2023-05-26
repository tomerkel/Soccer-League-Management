<template>
  <div id="details">
    <h1 class="title">About US
      <b-icon icon="file-earmark-person" animation="fade" font-scale="1"></b-icon>
    </h1>
    <p class="mx-auto" id="text">
      Welcome to our SUPERLEAGUE website. We are Gal Agasi and Tomer Kelner.<br>
      We are 3rd year students in the Informain Systems and Software Engineering department at Ben-Gurion University.<br>
      We created this website during our Web Development course.<br>
      Take a look of our former works:<br>
    </p>
    <div id= "links">
      <a href="https://web-development-environments-2021.github.io/311427389/">Tomer's first website 
        <b-icon icon="github"></b-icon>
      </a>
      <br>
      <a href="https://web-development-environments-2021.github.io/206348880/">Gal's first website
        <b-icon icon="github"></b-icon>
      </a>
      <br>
      <a href="https://web-development-environments-2021.github.io/Assignment2_206348880_311427389/"> Pacman Game
        <b-icon icon="bookmark-heart-fill"></b-icon>
      </a>
    </div>

    <div id="namesld">
      <h1> Contect us via <b-icon icon="linkedin"></b-icon></h1>
      <a
        class="namelink"
        href="https://www.linkedin.com/in/tomer-kelner-819938210/"
        >Tomer Kelner
      </a>
      <br>
      <a
        class="namelink"
        href="https://www.linkedin.com/in/gal-agasi-188284207/"
        >Gal Agasi
      </a>
    </div>
  </div>
</template>

<script>
</script>

<style>

#details{
  text-align: center;
  font-size: 25px;
  padding: 1%;
}

#text{
  padding-top: 2%;
  width: 75%;
}

#links a{
  text-align: center;
  color: rgb(42, 48, 138);
  transition: all 1s ease;
}

#namesld {
  text-align: center;
  background-color: #66ca9d;
  padding: 10px 10px;
  margin-left: 35%;
  margin-right: 35%;
  font-size: 22px;
  border-radius: 30px;
  transition: all 1s ease;
  opacity: 0.8;
  margin-top: 2%;
}



#namesld:hover {
  transform: scale(1.1);
  color: rgb(42, 48, 138);
}


.namelink {
  color: whitesmoke;
}

.namelink:hover {
  color: rgb(42, 48, 138);
}

</style>